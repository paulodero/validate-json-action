"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("./configuration");
const json_validator_1 = require("./json-validator");
const core = require('@actions/core');
//const getConfig = require('./configuration');
//const verifyConfigValues = require('./configuration');
//const validateJsons = require('./json-validator');
async function run() {
    try {
        const configuration = configuration_1.getConfig();
        const configurationErrors = configuration_1.verifyConfigValues(configuration);
        if (configurationErrors) {
            configurationErrors.forEach(e => core.error(e));
            core.setFailed('Missing configuration');
            return;
        }
        const jsonRelativePaths = configuration.JSONS.split(',');
        const validationResults = await json_validator_1.validateJsons(configuration.GITHUB_WORKSPACE, configuration.SCHEMA, jsonRelativePaths);
        const invalidJsons = validationResults.filter(res => !res.valid).map(res => res.filePath);
        core.setOutput('INVALID', invalidJsons.length > 0 ? invalidJsons.join(',') : '');
        if (invalidJsons.length > 0) {
            core.setFailed('Failed to validate all JSON files.');
        }
        else {
            core.info(`✅ All files were validated successfully.`);
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
