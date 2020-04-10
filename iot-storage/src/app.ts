//entrpoint name at my hosting has to be app.js
import app from "./application";
const PORT = 3000;

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})