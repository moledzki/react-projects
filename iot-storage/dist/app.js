"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//entrpoint name at my hosting has to be app.js
const application_1 = require("./application");
const PORT = 3000;
application_1.default.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
});
//# sourceMappingURL=app.js.map