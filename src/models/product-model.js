export default class ProductModel {
  constructor(data = {}) {
    this.clientId = data.clientId || null;
    this.id = data.id || null;
    this.name = data.name || '';
    this.category = data.category || '';
    this.subCategory = data.subCategory || '';
    this.fancyName = data.fancyName || '';
    this.description = data.description || '';
    this.additionalText = data.additionalText || '';
    this.price = data.price || '';
    this.type = data.type || 'food';
    this.available = data.available || true;
    this.editMode = true;
    this.crossSales = data.crossSales || [];
    this.visible = data.visible || true;
    this.usedForCrossSales = data.usedForCrossSales || false; // TODO name
    this.images = data.images || [];
    this.slug = data.slug || '';
    this.tags = data.tags || [];
    this.weight = data.weight || null;
    this.path = data.path || null;
    this.capacity = data.capacity || null;
  }
}

ProductModel.transformModel = (input) => {
  const data = { ...input };
  data.type = data.type ? 'bar' : 'food';
  data.category = data.category ? data.category.value : '';
  data.subCategory = data.subCategory ? data.subCategory.value : '';
  data.crossSales = data.selectedCrossSales ? data.selectedCrossSales.map((v) => v.value) : [];
  data.usedForCrossSales = data.forCrossSales;
  if (data.slug) {
    data.path = '/' + data.slug;
  }
  if (!data.fancyNae) {
    data.fancyName = data.name;
  }
  delete data.selectedCrossSales;
  delete data.forCrossSales;
  return data;
};
