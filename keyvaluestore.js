  var AWS = require('aws-sdk');
  AWS.config.loadFromPath('./config.json');

  var db = new AWS.DynamoDB();

  function keyvaluestore(table) {
    this.LRU = require("lru-cache");  
    this.cache = new this.LRU({ max: 500 });
    this.tableName = table;
  };

  /**
   * Initialize the tables
   * 
   */
  keyvaluestore.prototype.init = function(whendone) {
    
    var tableName = this.tableName;

    var params = {
      TableName: tableName
    }
    //Describe la tabla en la consola.
    db.describeTable(params, (err, data) => {
      if(err) {
        console.log(err);
      } else {
        console.log(data);
        whendone(); //Call Callback function.
      }
    });

    
  };

  /**
   * Get result(s) by key
   * 
   * @param search
   * 
   * Callback returns a list of objects with keys "inx" and "value"
   */
  
keyvaluestore.prototype.get = function(search, callback) {
    var self = this;
    
    if (self.cache.get(search))
          callback(null, self.cache.get(search));
    else {
      let items = [];
      if(this.tableName == "images") {
        console.log("========= IMAGES =========");
        /* ExpressionAttributeNames: Traduce los atributos de
          la tabla, en caso de que haya un nombre que coincida
          con el nombre de alguna palabra reservada.

          ExpressionAttributeValues: Aqui especifico que la llave
          sea un parámetro de búsqueda, de tipo String.

          KeyConditionExpression: Otra traducción de nombre para
          utilizarlo en ExpressionAttributeValues

          ProjectionExpression: Aqui se ponen los campos a jalarlos.
        */
        let params = {
          TableName: this.tableName,
          ExpressionAttributeNames: {
            '#keyw': 'keyword',
            '#murl': 'url'
          },
          ExpressionAttributeValues:{
            ":key" : {S: search}
          },
          KeyConditionExpression: '#keyw = :key',
          ProjectionExpression: '#murl,#keyw'
        };
        //Se jalan los datos y se hace un for each
        //para meterlos en el arreglo items que se mete despues
        //en la cache.
        db.query(params, (err, data) => {
          if(err) {
            console.log(err);
          } else {
            console.log(data);
            let items = [];
            data.Items.forEach(item => {
              console.log("Item =>", item);
              items.push({
                "keyword": item.keyword
                ,"url": item.url.S
              });
            });
            self.cache.set(search,items);
            callback(null,items);
            };
          }
        );
      } else if (this.tableName == "labels") {
        console.log("========= LABELS =========");
        /* ExpressionAttributeNames: Traduce los atributos de
          la tabla, en caso de que haya un nombre que coincida
          con el nombre de alguna palabra reservada.

          ExpressionAttributeValues: Aqui especifico que la llave
          sea un parámetro de búsqueda, de tipo String.

          KeyConditionExpression: Otra traducción de nombre para
          utilizarlo en ExpressionAttributeValues

          ProjectionExpression: Aqui se ponen los campos a jalarlos.
        */
        var params = {
          TableName: this.tableName,
          ExpressionAttributeNames: {
            '#keyw': 'keyword',
            '#cat': 'category'
          },
          ExpressionAttributeValues:{
            ":key" : {S: search}
          },
          KeyConditionExpression: '#keyw = :key',
          ProjectionExpression: 'inx,#cat,#keyw'
        };
        //Se jalan los datos y se hace un for each
        //para meterlos en el arreglo items que se mete despues
        //en la cache.
        db.query(params, (err, data) => {
          if(err) {
            console.log(err);
          } else {
            console.log(data);
            let items = [];
            data.Items.forEach(item => {
              console.log("Item =>", item);
              items.push({
                "keyword": item.keyword
                ,"inx": item.inx.N
                ,"category": item.category.S
              });
            });
            self.cache.set(search,items);
            callback(null,items);
            };
          }
        );
      }
    }
  };


  module.exports = keyvaluestore;
