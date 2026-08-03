/**
 * Vérifie isAdmin ou ACL. Renvoie 403 (et non 401) pour ne pas déclencher
 * la déconnexion automatique du client http (auth.js écoute les 401).
 */
module.exports = (aclRefs = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Accès non autorisé" });
    }

    if (req.user.isAdmin) {
      return next();
    }

    const userAcl = req.session?.passport?.user?.acl || req.user.acl || [];
    if (aclRefs.some((ref) => userAcl.includes(ref))) {
      return next();
    }

    return res.status(403).json({ message: "Accès non autorisé" });
  };
};
