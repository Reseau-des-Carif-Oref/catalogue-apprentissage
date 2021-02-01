const { PsFormation, Etablissement } = require("../../common/model");
const { asyncForEach } = require("../../common/utils/asyncUtils");
const { etablissement } = require("../common/utils/formater");
const { paginator } = require("../common/utils/paginator");
const mongoose = require("mongoose");

module.exports = async () => {
  await paginator(
    PsFormation,
    { filter: { matching_type: { $ne: null } }, lean: true },
    async ({ matching_mna_formation, _id }) => {
      let etablissements = [];

      await asyncForEach(
        matching_mna_formation,
        async ({ uai_formation, etablissement_formateur_uai, etablissement_gestionnaire_uai }) => {
          let exist = etablissements.find(
            (x) =>
              x.uai === uai_formation ||
              x.uai === etablissement_formateur_uai ||
              x.uai === etablissement_gestionnaire_uai
          );

          if (exist) return;

          if (uai_formation) {
            let resuai = await Etablissement.find({ uai: uai_formation });

            if (resuai.length > 0) {
              resuai.forEach((x) => {
                const formatted = etablissement(x);
                etablissements.push({ ...formatted, matched_uai: "UAI_FORMATION" });
              });
            }
          }

          if (etablissement_formateur_uai) {
            let resformateur = await Etablissement.find({ uai: etablissement_formateur_uai });

            if (resformateur.length > 0) {
              resformateur.forEach((x) => {
                const formatted = etablissement(x);
                etablissements.push({ ...formatted, matched_uai: "UAI_FORMATEUR" });
              });
            }
          }

          if (etablissement_gestionnaire_uai) {
            let resgestionnaire = await Etablissement.find({ uai: etablissement_gestionnaire_uai });

            if (resgestionnaire.length > 0) {
              resgestionnaire.forEach((x) => {
                const formatted = etablissement(x);
                etablissements.push({ ...formatted, matched_uai: "UAI_GESTIONNAIRE" });
              });
            }
          }
        }
      );

      if (etablissements.length === 0) return;

      const result = etablissements.reduce((acc, item) => {
        if (!acc[item._id]) {
          acc[item._id] = item;
          acc[item._id].matched_uai = [acc[item._id].matched_uai];
        } else {
          const exist = acc[item._id].matched_uai.includes(item.matched_uai);
          if (acc[item._id].matched_uai !== item.matched_uai) {
            if (!exist) {
              acc[item._id].matched_uai = acc[item._id].matched_uai.concat([item.matched_uai]);
            }
          }
        }
        return acc;
      }, {});

      const formatted = Object.values(result).map((x) => {
        return {
          _id: mongoose.Types.ObjectId(),
          ...x,
        };
      });

      await PsFormation.findByIdAndUpdate(_id, {
        matching_mna_etablissement: formatted,
      });
    }
  );
};
