/**
 * Groups the given items, nesting them by the given keys.
 * Items with the same key combinations will have their values summed.
 *
 * For example suppose we have:
 *
 *   var items = [
 *     { company: 'c1', cluster: 'k2', territory: 'DE', value: 4 },
 *     { company: 'c1', cluster: 'k2', territory: 'FR', value: 6 },
 *     { company: 'c1', cluster: 'k3', territory: 'DE', value: 2 },
 *     { company: 'c2', cluster: 'k1', territory: 'GB', value: 3 }
 *   ];
 *
 * Then:
 *
 *   var company_to_territory_to_value = group(items, ['company', 'territory'], 'value');
 *
 *   // Returns:
 *   { c1: { DE: 6, FR: 6 }, c2: { GB: 3 } }
 *
 * @param {Object[]} items - The items to group. Must contain the properties for each of the given group_by and value_key.
 * @param {string[]} group_by - The item keys to group by, in order.
 * @param {?string} value_key - Optional value key. Defaults to 'value'.
 */
function group(items, group_by, value_key) {
  value_key = value_key || 'value';
  var target = {};
  items.forEach(function(item) {
    insert_item(item, target, group_by, value_key);
  });
  return target;
}

/**
 * Nests the item's value within the target.
 * Item's value will be added onto any existing value.
 * Item will be nested according to the nest_keys.
 * For example suppose we have:
 *
 *   var item      = { company: 'c1', cluster: 'k2', territory: 'uk', value: 4 };
 *   var target    = { c1: { uk: 1, de: 3 }};
 *   var nest_keys = [ 'company', 'territory'];
 *   var value_key = 'value';
 *
 * Then insert_item will mutate and return target:
 *
 *   { c1: { uk: 5, de: 3 } }
 *
 * @param {Object} item - The item to add. Must contain the properties for the given nest and value keys.
 * @param {Object} target - The target to add the item to.
 * @param {string[]} group_by - The item keys to group by, in order.
 * @param {string} value_key - The key for the value
 */
function insert_item(item, target, group_by, value_key) {
  // Get nest keys (we use the items values here)
  var keys           = group_by.map(function(key) { return item[key]; });
  var keys_to_parent = keys.slice(0, keys.length - 1);
  var last_key       = keys.slice(-1)[0];

  // Get parent object - this is the object that holds item's value.
  // Any intermediate objects wil be created if they don't already exist.
  // i.e. target.c1 (in the example)
  var parent = get_nested_object(target, keys_to_parent);

  // Add in item's value
  var value      = parent[last_key] || 0;
  var item_value = item[value_key];
  parent[last_key] = value + item_value;

  return target;
}

/**
 * Given target object, and nest keys [k1, k2, ... kn],
 * ensures that target.k1.k2...kn exists.
 * Intermediate objects will be created if necessary.
 * Returns the lowest level object.
 * @param {Object} target
 * @param {string[]} nest_levels
 */
function get_nested_object(target, nest_keys) {
  var parent = target;
  nest_keys.forEach(function(key) {
    if (typeof parent[key] === 'undefined') {
      parent[key] = {};
    }
    parent = parent[key]; // descend into object
  });
  return parent;
}

var items = [
  { company: 'c1', cluster: 'k1', territory: 'GB', value: 11 },
  { company: 'c1', cluster: 'k1', territory: 'DE', value: 3 },
  { company: 'c1', cluster: 'k1', territory: 'FR', value: 3 },
  { company: 'c1', cluster: 'k2', territory: 'GB', value: 4 },
  { company: 'c1', cluster: 'k2', territory: 'DE', value: 4 },
  { company: 'c1', cluster: 'k2', territory: 'FR', value: 6 },
  { company: 'c1', cluster: 'k3', territory: 'DE', value: 2 },
  { company: 'c2', cluster: 'k1', territory: 'GB', value: 3 },
  { company: 'c2', cluster: 'k1', territory: 'DE', value: 7 },
  { company: 'c2', cluster: 'k2', territory: 'GB', value: 7 },
  { company: 'c2', cluster: 'k2', territory: 'DE', value: 2 },
  { company: 'c2', cluster: 'k2', territory: 'FR', value: 3 },
  { company: 'c2', cluster: 'k3', territory: 'GB', value: 8 },
  { company: 'c2', cluster: 'k3', territory: 'FR', value: 1 }
];

var items2 = [
  { company: 'c1', cluster: 'k2', territory: 'DE', value: 4 },
  { company: 'c1', cluster: 'k2', territory: 'FR', value: 6 },
  { company: 'c1', cluster: 'k3', territory: 'DE', value: 2 },
  { company: 'c2', cluster: 'k1', territory: 'GB', value: 3 }
];

var company_to_territory_to_value = group(items, ['company', 'territory'], 'value');
var company_to_territory_to_value2 = group(items2, ['company', 'territory'], 'value');
