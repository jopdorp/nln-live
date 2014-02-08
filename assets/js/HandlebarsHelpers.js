Handlebars.registerHelper('getLength', function (a) {
    return a && a.length;
});

Handlebars.registerHelper('cutString', function (str, len) {
    return (str.length > len)?str.substr(0, Math.max(len-3, 0))+'...':str;
});

Handlebars.registerHelper('eq', function (a, b) {
    return (a === b); //Only text, numbers, boolean - not array & objects
});

Handlebars.registerHelper('neq', function (a, b) {
    return (a !== b); //Only text, numbers, boolean - not array & objects
});

Handlebars.registerHelper('in', function (a, b, c, d) {
    return ( a === b || a === c || a === d);
});

Handlebars.registerHelper('nin', function (a, b, c, d) {
    return ( a !== b && a !== c && a !== d);
});

Handlebars.registerHelper('exists', function (a) {
    return ( a !== undefined);
});

Handlebars.registerHelper('lt', function (a, b) {
    return (a < b);
});

Handlebars.registerHelper('gt', function (a, b) {
    return (a > b);
});

Handlebars.registerHelper('lte', function (a, b) {
    return (a <= b);
});

Handlebars.registerHelper('gte', function (a, b) {
    return (a >= b);
});


Handlebars.registerHelper('and', function (a, b) {
    return (a && b);
});

Handlebars.registerHelper('or', function (a, b) {
    return (a || b);
});

Handlebars.registerHelper('not', function (a) {
    return (!a);
});
