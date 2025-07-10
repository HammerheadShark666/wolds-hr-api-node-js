"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
describe('GET /api/hello', () => {
    it('should return a message', async () => {
        const response = await (0, supertest_1.default)(app_1.default).get('/api/hello');
        expect(response.status).toBe(200);
        expect(response.body.message).toBeDefined();
    });
});
