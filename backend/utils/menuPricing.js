// backend/utils/menuPricing.js

const fail = (message) => {
  const err = new Error(message);
  err.status = 400; 
  throw err;
};

const norm = (s) => String(s ?? "").trim().toLowerCase();

// Get the price of an add-on option for a specific menu item variant (size)
export const getOptionPrice = (option, variant) => {
  const match = (option.sizePrices || []).find(
    (s) => norm(s.label) === norm(variant?.label)
  );
  return match ? match.price : option.price;
};

export const calculateLinePrice = (item, variantId, addonOptionIds = []) => {
  if (!item.inStock) fail(`${item.name} is currently out of stock`);

  const variants = item.variants || [];
  const variant = variantId
    ? variants.find((v) => String(v._id) === String(variantId))
    : variants.length === 1 ? variants[0] : null;

  if (!variant) fail(`Please select a size for ${item.name}`);
  if (!variant.isAvailable) fail(`${item.name} (${variant.label}) is not available`);

  const remaining = new Set((addonOptionIds || []).map(String));
  const addons = [];

  for (const group of (item.addonGroups || []).filter(Boolean)) {
    if (!group.isActive) continue;

    const chosen = group.options.filter((o) => remaining.has(String(o._id)));
    chosen.forEach((o) => remaining.delete(String(o._id)));

    if (chosen.length < group.minSelect) {
      fail(`Please choose at least ${group.minSelect} option(s) from ${group.name} for ${item.name}`);
    }
    if (group.maxSelect > 0 && chosen.length > group.maxSelect) {
      fail(`You can choose at most ${group.maxSelect} option(s) from ${group.name}`);
    }

    for (const option of chosen) {
      if (!option.isAvailable) fail(`${option.name} is not available right now`);
      addons.push({
        groupId:   group._id,
        groupName: group.name,
        optionId:  option._id,
        name:      option.name,
        price:     getOptionPrice(option, variant),
      });
    }
  }

  // Anything left over does not belong to this item
  if (remaining.size > 0) fail(`Invalid add-on selected for ${item.name}`);

  const unitPrice = variant.price + addons.reduce((sum, a) => sum + a.price, 0);

  return {
    variant: { _id: variant._id, label: variant.label, price: variant.price },
    addons,
    unitPrice,
  };
};
