const TYPE_COPY_PROPERTIES = "@copy";
const filterPseudoElements = [":before", ":after"];
const filterSpecialRules   = ["@keyframes", "@media"];
const filterPropertyNames  = ["content"];
const filterPropertyValues = ["attr"];
let specialClasses         = [];
const toKebab              = string => string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();

const prepareStyles = styles => {
  const keys = Object.keys(styles);

  const replaceProperties = (_styles, property, key) => {
    if (property === TYPE_COPY_PROPERTIES) {
      const parentNameProperties = _styles[key][property];
      const copyParentProperties = _styles[parentNameProperties];
      const newProperties = { ...copyParentProperties, ..._styles[key] };
      delete newProperties[TYPE_COPY_PROPERTIES];
      _styles[key] = newProperties;
    }

    return _styles;
  };

  keys.forEach(key => {
    const properties = Object.keys(styles[key]);
    properties.forEach(property => {
      if (
        Object.prototype.toString.call(styles[key][property]) === "[object Object]"
      ) {
        const privateNamesProperties = Object.keys(styles[key][property]);
        privateNamesProperties.forEach(privateKey => {
          if (privateKey === TYPE_COPY_PROPERTIES) {
            const privateProperties            = styles[key][property][privateKey];
            const [nameClass, namePseudoClass] = privateProperties.split(":");
            const privateCopiedProperties      = styles[nameClass][`:${namePseudoClass}`];
            const _properties = {
              ...privateCopiedProperties,
              ...styles[key][property]
            };

            delete _properties[TYPE_COPY_PROPERTIES];
            styles[key][property] = _properties;

            prepareStyles(styles);
          }
        });

        return;
      }

      replaceProperties(styles, property, key);
    });
  });

  return styles;
};

const getRules = rules => {
  return Object.keys(rules).reduce((state, rule) => {
    if (rule[0] === ":" || filterPseudoElements.includes(rule)) {
      const object = {};
      object[rule] = rules[rule];
      specialClasses.push(object);
      return state;
    }

    let property = rules[rule];
    if (filterPropertyNames.includes(rule) && !filterPropertyValues.includes(rules[rule])) {
      property = `"${rules[rule]}"`;
    }

    state += `${toKebab(rule)}: ${property};`;
    return state;
  }, "");
};

const parseKeyframesRule = object => {
  let string = "";
  Object.keys(object).forEach(key => {
    string += `${key} { ${getRules(object[key])} }`;
  });

  return string;
};

export default function createStyles(styles, options = {}) {
  styles = prepareStyles(styles);
  const stylesOfComponentWithPrefixIfNeeded = {};
  const stylesOfComponent = Object.keys(styles).reduce((state, item) => {
    state[item] = item;
    stylesOfComponentWithPrefixIfNeeded[item] = options.prefix ? `${options.prefix}-${item}` : item;
    
    return state;
  }, {});

  const styleElement = (() => {
    if (document.querySelectorAll('[di-styles-react="true"]').length) {
      return document.querySelectorAll('[di-styles-react="true"]')[0];
    }

    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.setAttribute("di-styles-react", true);

    return style;
  })();

  Object.keys(stylesOfComponent).forEach(component => {
    const prefix = options.prefix ? `${options.prefix}-` : "";
    const rules = getRules(styles[component]);
    let strRule = `.${prefix}${component}{${rules}}`;

    if (filterSpecialRules.includes(component.split(" ")[0])) {
      strRule = `${component} { ${parseKeyframesRule(styles[component])} }`;
    }

    const textNode = document.createTextNode(strRule);
    styleElement.appendChild(textNode);

    if (specialClasses.length) {
      specialClasses.forEach(item => {
        const specialRule = Object.keys(item)[0];
        const specialRules = getRules(item[specialRule]);
        const specialString = `.${prefix}${component}${specialRule}{${specialRules}}`;
        const specialTextNode = document.createTextNode(specialString);
        styleElement.appendChild(specialTextNode);
      });
    }

    specialClasses = [];
  });

  document.head.appendChild(styleElement);

  return () => stylesOfComponentWithPrefixIfNeeded;
}
