const dbConnection = require('./dbConnectionPool');

module.exports = class LoginSignUpDB {


  /**
   * ========================= Starts restaurantTable ==============================
   */

  async createNewOwner(table, inputData) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let savedUser = await con.query('INSERT INTO ?? SET ?', [table, inputData]);
      await con.query("COMMIT");
      inputData.id = savedUser.insertId;
      console.log(inputData);
      return inputData;
    } catch (ex) {
      console.log(ex);
      await con.query("ROLLBACK");
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }


  async checkIfRestaurantExists(table, email) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let result = await con.query('SELECT * FROM ?? WHERE restaurantEmailId = ?', [table, email]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async getRestaurantDetails(table, restaurantId) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      console.log("SELECT * FROM " + table + " WHERE restaurantId = " + restaurantId);
      let result = await con.query("SELECT * FROM ?? WHERE restaurantId = ?", [table, restaurantId]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async addRestaurantProfilePic(table, id, filename) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      await con.query(`UPDATE ?? SET restaurantImage = ? WHERE restaurantId = ?`, [
        table,
        filename,
        id
      ]);
      await con.query("COMMIT");
      return true;
    } catch (ex) {
      await con.query("ROLLBACK");
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async getRestaurantProfilepic(table, id) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      console.log("get profile piC")
      let result = await con.query('SELECT restaurantImage FROM ?? WHERE restaurantId = ?', [table, id]);
      await con.query("COMMIT");
      console.log("result in db ")
      console.log(result)
      result = JSON.parse(JSON.stringify(result[0]));
      console.log("result in db ")
      console.log(result)
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async updateOwner(table, restaurantId, inputData) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      await con.query(`UPDATE ?? SET restaurantName = ?, restaurantPhone = ?, restaurantAddress = ?
            WHERE restaurantId = ?`, [
        table,
        inputData.restaurantName,
        inputData.restaurantPhone,
        inputData.restaurantAddress,
        restaurantId
      ]);
      await con.query("COMMIT");
      //console.log("in login db  "+inputData);
      return true;
    } catch (ex) {
      await con.query("ROLLBACK");
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async ownerLogin(table, emailId, password) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      //select * from buyerTable where emailId = 'admin' and userPassword = 'd033e22ae348aeb5660fc2140aec35850c4da997'
      let result = await con.query('SELECT * FROM ?? WHERE restaurantEmailId = ? AND restaurantPassword = ?', [table, emailId, password]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      console.log("result in login db" + result)
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  /**
   * ===================================== starts buyerTable =========================================
   */

  async buyerLogin(table, emailId, password) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      //select * from buyerTable where emailId = 'admin' and userPassword = 'd033e22ae348aeb5660fc2140aec35850c4da997'
      let result = await con.query('SELECT * FROM ?? WHERE buyerEmailId = ? AND buyerPassword = ?', [table, emailId, password]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      console.log("result in login db" + result)
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async checkIfBuyerExists(table, email) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let result = await con.query('SELECT * FROM ?? WHERE buyerEmailId = ?', [table, email]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async updateBuyer(table, buyerId, inputData) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      await con.query(`UPDATE ?? SET buyerName = ?, buyerPhone = ?, buyerAddress = ?
            WHERE buyerId = ?`, [
        table,
        inputData.buyerName,
        //inputData.img,
        inputData.buyerPhone,
        inputData.buyerAddress,
        buyerId
      ]);
      await con.query("COMMIT");
      //console.log("in login db  "+inputData);
      return true;
    } catch (ex) {
      await con.query("ROLLBACK");
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async addBuyerProfilePic(table, id, filename) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      await con.query(`UPDATE ?? SET buyerImage = ? WHERE buyerId = ?`, [
        table,
        filename,
        id
      ]);
      await con.query("COMMIT");
      return true;
    } catch (ex) {
      await con.query("ROLLBACK");
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async getBuyerProfilepic(table, id) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      console.log("In get profile [piv")
      let result = await con.query('SELECT buyerImage FROM ?? WHERE buyerId = ?', [table, id]);
      await con.query("COMMIT");
      console.log("result in db ")
      console.log(result)
      result = JSON.parse(JSON.stringify(result[0]));
      console.log("result in db ")
      console.log(result)
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async checkIfBuyerExists(table, emailId) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let result = await con.query('SELECT * FROM ?? WHERE buyerEmailId = ?', [table, emailId]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async getBuyerDetails(table, buyerId) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let result = await con.query('SELECT * FROM ?? WHERE buyerId = ?', [table, buyerId]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async createNewBuyer(table, inputData) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let savedUser = await con.query('INSERT INTO ?? SET ?', [table, inputData]);
      await con.query("COMMIT");
      inputData.id = savedUser.insertId;
      console.log(inputData);
      return inputData;
    } catch (ex) {
      console.log(ex);
      await con.query("ROLLBACK");
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  /**
   * ======================= Starts restaurantOrderTable ======================================
   */

  async postNewRestaurantOrder(table, restaurantOrderData) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      console.log("Adding " + restaurantOrderData + " to " + table);
      let result = await con.query('INSERT INTO ?? SET ?', [table, restaurantOrderData]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async deleteOrderFromRestaurantTable(table, uniqueOrderId) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let result = await con.query('DELETE FROM ?? WHERE uniqueOrderId = ?', [table, uniqueOrderId]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async updateOrderByRestaurant(table, updateData) {
    let con = await dbConnection();
    let uniqueOrderId = updateData.uniqueOrderId;
    let orderStatus = updateData.orderStatus;
    try {
      await con.query("START TRANSACTION");
      console.log('UPDATE ' + table + ' SET restaurantOrderStatus = ' + orderStatus + ' WHERE uniqueOrderId = ' + uniqueOrderId);
      let result = await con.query('UPDATE ?? SET restaurantOrderStatus = ? WHERE uniqueOrderId = ?', [table, orderStatus, uniqueOrderId]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      console.log(result);
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async getOrderDetailsFromDB(table, restaurantId, orderStatus) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      console.log('SELECT * FROM ' + table );
      // ' WHERE restaurantId = ' + restaurantId + ' AND restaurantOrderStatus = ' + orderStatus);
      let result = await con.query('SELECT * FROM ??', [table]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async getOrderDetailsById(table, uniqueOrderId) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      console.log('SELECT * FROM ' + table + ' WHERE uniqueOrderId = ' + uniqueOrderId);
      let result = await con.query('SELECT * FROM ?? WHERE uniqueOrderId = ?', [table, uniqueOrderId]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  /**
   * ===================== starts buyerOrderTable =======================
   */


  async updateBuyerOrderTable(table, uniqueOrderId, orderStatus) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let result = await con.query('UPDATE ?? SET buyerOrderStatus = ? WHERE uniqueOrderId = ?', [table, orderStatus, uniqueOrderId]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      console.log(result);
      return result;
    } catch (ex) {
      console.log("Caught DB Exception");
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async getBuyerOrderTable(table, uniqueOrderId, orderStatus) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let result = await con.query('SELECT * FROM buyerOrderTable');
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      console.log(result);
      return result;
    } catch (ex) {
      console.log("Caught DB Exception");
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async postNewBuyerOrder(table, buyerOrderData) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let result = await con.query('INSERT INTO ?? SET ?', [table, buyerOrderData]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  /**
  *  ================ Starts orderItemInfoTable ==========================
  */

  async addToOrderItemInfoTable(table, totalOrderItemsData) {
    let con = await dbConnection();
    let uniqueOrderId = totalOrderItemsData.uniqueOrderId;
    let orderItemsInfo = totalOrderItemsData.cartItems;
    console.log("Adding all items in order " + uniqueOrderId);
    console.log(orderItemsInfo);
    console.log(orderItemsInfo.length);
    let index = 0;
    let result = undefined;
    try {
      await con.query("START TRANSACTION");
      for (index = 0; index < orderItemsInfo.length; index++) {
        console.log("in loop at index= " + index);
        let postOrderItemInfoData = {
          uniqueOrderId: uniqueOrderId,
          itemId: orderItemsInfo[index].itemId,
          itemName: orderItemsInfo[index].itemName,
          itemQuantity: orderItemsInfo[index].itemQuantity,
          itemTotalPrice: parseFloat(orderItemsInfo[index].itemTotalPrice),
        }
        console.log('INSERT INTO ' + table + ' SET ' + postOrderItemInfoData);
        console.log(postOrderItemInfoData);
        result = await con.query('INSERT INTO ?? SET ?', [table, postOrderItemInfoData]);
      }
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async getOrderItemsInfo(table) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      console.log("Running SELECT * FROM " + table);
      let result = await con.query('SELECT * FROM ?? ', [table]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async deletOrderFromOrderItemInfoTable(table, uniqueOrderId) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      console.log("Running DELETE FROM " + table + " WHERE uniqueOrderId = " + uniqueOrderId);
      let result = await con.query('DELETE FROM ?? WHERE uniqueOrderId = ?', [table, uniqueOrderId]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  /**
   * ================= Starts restaurantMenuTable ================================================
   */

  async getMenuItemImage(table, id) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let query = "SELECT * FROM " + table + " WHERE menuItemId = " + id;
      console.log("Query: " + query);
      let result = await con.query(query);
      await con.query("COMMIT");
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async addMenuItemImage(table, id, filename) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      console.log(filename)
      await con.query(`UPDATE ?? SET menuItemImage = ? WHERE menuItemId = ?`, [
        table,
        filename,
        id
      ]);
      await con.query("COMMIT");
      return true;
    } catch (ex) {
      await con.query("ROLLBACK");
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async getAllItemMatches(table, queryMenuItem) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      console.log("Running SELECT * FROM " + table + " WHERE menuItemName = " + queryMenuItem);
      let result = await con.query('SELECT * FROM ??', [table]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async getMenu(table, restaurantId) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      console.log("Running SELECT * FROM " + table );
      let result = await con.query('SELECT * FROM ??', [table]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async addMenuItem(table, data) {
    let con = await dbConnection();
    console.log(data);
    try {
      await con.query("START TRANSACTION");
      console.log("Running INSERT INTO " + table + " SET " + data);
      let result = await con.query('INSERT INTO ?? SET ?', [table, data]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async deleteMenuItem(table, menuItemId) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      console.log("Running DELETE FROM " + table + " WHERE menuItemId = " + menuItemId);
      let result = await con.query('DELETE FROM ?? WHERE menuItemId = ? ', [table, menuItemId]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }


  /**
   * ======================== STARTS restaurantSectionTable =========================================
   */

  async getSections(table, restaurantId) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      console.log("Running SELECT * FROM " + table);
      let result = await con.query('SELECT * FROM ?? ', [table]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async deleteSection(table, sectionItemId) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let result = await con.query('DELETE FROM ?? WHERE sectionItemId = ?', [table, sectionItemId]);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

  async addSection(restaurantId, sectionName) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let queryString = "INSERT INTO restaurantSectionTable SET restaurantId = " + restaurantId + ", sectionName = '" + sectionName + "'";
      console.log(queryString);
      let result = await con.query(queryString);
      await con.query("COMMIT");
      result = JSON.parse(JSON.stringify(result));
      console.log(result);
      return result;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }

}
