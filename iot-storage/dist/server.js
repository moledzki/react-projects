"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("./application");
const PORT = 3210;
application_1.default.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
});
//# sourceMappingURL=server.js.map