/**
 * Создает и заполняет новый документ данными
 *
 * @param  {string} catalogName название каталога документа
 * @param  {object} data объект с данными нового документа
 * @returns {xmldoc} созданный документ
 */
function run(catalogName, data) {
  // Загружаем необходимые функции
  var functions = OpenCodeLib('import.js').run(['typeOf']);

  /**
   * Создает и заполняет узлы XmlElem данными
   *
   * @param {xmlelem} xmlElem узел документа
   * @param {string} propName название узла
   * @param {any} propData данные узла
   */
  function addXmlElem(xmlElem, propName, propData) {
    var type = functions.typeOf.run(propData);
    if (type === 'string' || type === 'integer' || type === 'boolean') {
      xmlElem.Child(propName).Value = propData;
    }
    if (type === 'object') {
      var xmlObjElem = xmlElem.Child(propName);
      var xmlObjElemPropName;
      for (xmlObjElemPropName in propData) {
        addXmlElem(
          xmlObjElem,
          xmlObjElemPropName,
          propData[xmlObjElemPropName]
        );
      }
    }
    if (type === 'array') {
      var childData;
      var childPropName;
      for (childData in propData) {
        xmlArrElem = xmlElem.AddChild(propName);
        for (childPropName in childData) {
          addXmlElem(xmlArrElem, childPropName, childData[childPropName]);
        }
      }
    }
  }

  var doc = tools.new_doc_by_name(catalogName);
  var topElem = doc.TopElem;
  var propName;
  for (propName in data) {
    addXmlElem(topElem, propName, data[propName]);
  }
  doc.BindToDb(DefaultDb);
  doc.Save();
  return doc;
}
