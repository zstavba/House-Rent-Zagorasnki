"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorsController {
    constructor() {
        this.notFound = (req, res, next) => {
            res.status(404);
            if (req.accepts("html")) {
                res.render("dashboard/errors/404");
                return;
            }
        };
        this.errorMessage = (req, res, next) => {
        };
    }
}
exports.default = ErrorsController;
