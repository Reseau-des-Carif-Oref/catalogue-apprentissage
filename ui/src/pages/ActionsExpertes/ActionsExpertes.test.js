import React from "react";
import ActionsExpertes from "./ActionsExpertes";
import { renderWithRouter } from "../../common/utils/testUtils";

import { rest } from "msw";
import { setupServer } from "msw/node";
import { setAuthState } from "../../common/auth";
import { waitFor } from "@testing-library/react";

const server = setupServer(
  rest.get(/\/api\/parcoursup\/reconciliation\/count/, (req, res, ctx) => {
    return res(
      ctx.json({
        countValide: 10,
        countTotal: 100,
      })
    );
  }),

  rest.get(/\/api\/entity\/formations2021\/count/, (req, res, ctx) => {
    return res(ctx.json(1000));
  }),

  rest.get(/\/api\/v1\/entity\/messageScript/, (req, res, ctx) => {
    return res(ctx.json([]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders all actions for admin", async () => {
  setAuthState({ permissions: { isAdmin: true } });

  const { getByText, getByTestId } = renderWithRouter(<ActionsExpertes />);

  await waitFor(() => getByTestId("grid"));

  const reconciliationPsLink = getByText(/^Rapprochement des bases Carif-Oref et Parcoursup$/i);
  expect(reconciliationPsLink).toBeInTheDocument();

  const percentageLink = getByText(/^10\.00% de validées$/i);
  expect(percentageLink).toBeInTheDocument();

  const reconciliationAfLink = getByText(/^Rapprochement des bases Carif-Oref et Affelnet$/i);
  expect(reconciliationAfLink).toBeInTheDocument();

  const perimetrePsLink = getByText(/^Règles d'intégration des formations à la plateforme Parcoursup$/i);
  expect(perimetrePsLink).toBeInTheDocument();

  const perimetreAfLink = getByText(/^Règles d'intégration des formations à la plateforme Affelnet$/i);
  expect(perimetreAfLink).toBeInTheDocument();
});

test("renders ps actions for acl ps", async () => {
  setAuthState({ permissions: { isAdmin: false }, acl: ["page_perimetre_ps", "page_reconciliation_ps"] });

  const { queryByText, getByTestId } = renderWithRouter(<ActionsExpertes />);

  await waitFor(() => getByTestId("grid"));

  const reconciliationPsLink = queryByText(/^Rapprochement des bases Carif-Oref et Parcoursup$/i);
  expect(reconciliationPsLink).toBeInTheDocument();

  const percentageLink = queryByText(/^10\.00% de validées$/i);
  expect(percentageLink).toBeInTheDocument();

  const reconciliationAfLink = queryByText(/^Rapprochement des bases Carif-Oref et Affelnet$/i);
  expect(reconciliationAfLink).not.toBeInTheDocument();

  const perimetrePsLink = queryByText(/^Règles d'intégration des formations à la plateforme Parcoursup$/i);
  expect(perimetrePsLink).toBeInTheDocument();

  const perimetreAfLink = queryByText(/^Règles d'intégration des formations à la plateforme Affelnet$/i);
  expect(perimetreAfLink).not.toBeInTheDocument();
});

test("renders af actions for acl af", async () => {
  setAuthState({ permissions: { isAdmin: false }, acl: ["page_perimetre_af", "page_reconciliation_af"] });

  const { queryByText, getByTestId } = renderWithRouter(<ActionsExpertes />);

  await waitFor(() => getByTestId("grid"));

  const reconciliationPsLink = queryByText(/^Rapprochement des bases Carif-Oref et Parcoursup$/i);
  expect(reconciliationPsLink).not.toBeInTheDocument();

  const percentageLink = queryByText(/^10\.00% de validées$/i);
  expect(percentageLink).not.toBeInTheDocument();

  const reconciliationAfLink = queryByText(/^Rapprochement des bases Carif-Oref et Affelnet$/i);
  expect(reconciliationAfLink).toBeInTheDocument();

  const perimetrePsLink = queryByText(/^Règles d'intégration des formations à la plateforme Parcoursup$/i);
  expect(perimetrePsLink).not.toBeInTheDocument();

  const perimetreAfLink = queryByText(/^Règles d'intégration des formations à la plateforme Affelnet$/i);
  expect(perimetreAfLink).toBeInTheDocument();
});
