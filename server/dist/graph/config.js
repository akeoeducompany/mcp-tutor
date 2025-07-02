"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmishingReportConfigSchema = void 0;
const zod_1 = require("zod");
/* -------------------------------------------------------------------------- */
/*                     Optional Zod Schema Helper (runtime)                    */
/* -------------------------------------------------------------------------- */
exports.SmishingReportConfigSchema = zod_1.z.object({
    validation_model: zod_1.z.string().optional(),
    analysis_model: zod_1.z.string().optional(),
    content_model: zod_1.z.string().optional(),
    projectId: zod_1.z.string().optional(),
    dataset: zod_1.z.string().optional(),
    table: zod_1.z.string().optional(),
    lookbackDays: zod_1.z.number().optional(),
    s3Bucket: zod_1.z.string().optional(),
    fcmEnabled: zod_1.z.boolean().optional(),
    ttsEnabled: zod_1.z.boolean().optional(),
    cardCount: zod_1.z.number().optional(),
    trendCount: zod_1.z.number().optional(),
});
