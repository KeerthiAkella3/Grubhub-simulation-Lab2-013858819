const express = require('express');

var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
app.set('view engine', 'ejs');

router = express.Router();


/*
  * Call this end-point when restaurant needs to delete a section.
*/

/*
  * Call this endpoint from Restaurant Owner, when restaurant Owner is managing status of order
  * From new --> preparing --> ready --> delivered.
  */
// router.delete('/restaurantSection', function (req, res) {

//   let sectionName = req.query.sectionName;
//   let restaurantId = req.query.restaurantId;

//   const deleteSection = async () => {

//     getAllSectionsResult = await LoginSignUpDBObj.getSections("restaurantSectionTable");
//     if (getAllSectionsResult) {
//       console.log(getAllSectionsResult);
//       for (let index = 0; index < getAllSectionsResult.length; index++) {
//         let anSection = getAllSectionsResult[index];
//         console.log(anSection)
//         if (anSection.sectionName === sectionName && anSection.restaurantId === parseInt(restaurantId)) {
//           console.log('match found!')
//           sectionDeleteQuery = await LoginSignUpDBObj.deleteSection("restaurantSectionTable", anSection.sectionItemId);
//           if (sectionDeleteQuery === undefined) {
//             res.status(404).json({
//               responseMessage: 'Section Not Found!'
//             });
//           } else {
//             res.status(200).json({
//               responseMessage: "Section successfully Deleted!"
//             });
//           }
//           break;  
//         } else {
//           continue;
//         }
//       }
//     }
//   }

//   try {
//     deleteSection();
//   }
//   catch (err) {
//     console.log(err);
//     res.status(503).json({ responseMessage: 'Database not responding' });
//   }


module.exports = router;