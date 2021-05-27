import { createSelector } from 'reselect';

export const getClient = (state) => state.client;

export const getProducts = createSelector(getClient, (client) => client.products);

export const getClientId = createSelector(getClient, (client) => client._id);

export const getAvailableCrossSales = createSelector(getProducts, (products) =>
  products.filter((v) => v.usedForCrossSales).map((v) => ({ label: v.name, value: v.id })),
);

export const isThereUnsavedProduct = createSelector(
  getProducts,
  (products) => products.filter((v) => !v.id).length > 0,
);

export const isClientLoadFailed = createSelector(getClient, (client) => client.clientLoadFailed);

export const getClientsMetaData = createSelector(getClient, (client) => client.clientsMetaData);

export const showSelectClientModal = createSelector(getClient, (client) => client.showSelectClientModal);

export const isErrorShown = createSelector(getClient, (client) => client.error);

export const getUnsavedProduct = createSelector(
  [getProducts, isThereUnsavedProduct],
  (products, isThereUnsavedProduct) => {
    return isThereUnsavedProduct ? products.filter((v) => !v.id)[0] : [];
  },
);

export const getTexts = createSelector(getClient, ({ texts }) => texts);

export const getCategories = createSelector(getClient, ({ categories }) => categories);

export const getVisits = createSelector(getClient, ({ visits }) => visits);
