const ztlabels = require('../models/mongodb/ztlabels');
const ztvalues = require('../models/mongodb/ztvalues');
const ztroles = require('../models/mongodb/ztroles');

  // SERVICIO DE LABELS Y VALUES: CONSULTA, CREACIÓN, ACTUALIZACIÓN Y ELIMINACIÓN


// --- CONSULTA GENERAL DE LABELS Y VALUES ---
async function GetAllLabelsValues(req) {
    try {
        const query = req.req.query;
        const type = query?.type;

        if (type === 'label') {
            const labelId = query.id;
            if (labelId) {
                return await getLabelById(labelId);
            } else {
                return await getAllLabels();
            }
        } else if (type === 'value') {
            const valueId = query.id;
            const labelId = query.labelID;

            if (valueId) {
                return await getValueById(valueId);
            } else if (labelId) {
                return await getValuesByLabel(labelId);
            } else {
                return await getAllValues();
            }
        } else if (type === 'catalog') {
            return await getAllCatalog();
        } else {
            throw ({ code: 400, message: "Parámetro 'type' no válido. Usa 'label', 'value' o 'catalog'." });
        }
    } catch (error) {
        throw error;
    }
}

// --- CONSULTA DE LABELS ---
async function getAllLabels() {
    return await ztlabels.find({}).lean();
}

async function getLabelById(labelId) {
    return await ztlabels.findOne({ LABELID: labelId }).lean();
}

// --- CONSULTA DE VALUES ---
async function getAllValues() {
    return await ztvalues.find({}).lean();
}

async function getValueById(valueId) {
    return await ztvalues.findOne({ VALUEID: valueId }).lean();
}

async function getValuesByLabel(labelId) {
    return await ztvalues.find({ LABELID: labelId }).lean();
}

// --- CONSULTA DE CATÁLOGOS ---
async function getAllCatalog() {
    try {
        const labels = await ztlabels.find({}).lean();
        const allValues = await ztvalues.find({}).lean();

        const result = labels.map(label => {
            const valuesForLabel = allValues.filter(value => value.LABELID === label.LABELID);
            return {
                ...label,
                values: valuesForLabel
            };
        });

        return result;
    } catch (error) {
        console.error('Error en getLabelsWithValues:', error);
        throw error;
    }
}

// --- ACTUALIZACIÓN DE LABELS Y VALUES ---
async function UpdateLabelsValues(req) {
    const type = parseInt(req.req.query?.type);
    const id = req.req.query?.id;

    if (!id) {
        return { message: "Se requiere el parámetro 'id' para actualizar." };
    }

    if (type == 1) {
        const updateData = req.req.body.label;
        return patchLabels(req, id, updateData);
    } else if (type == 2) {
        const updateData = req.req.body.value;
        return patchValues(req, id, updateData);
    } else {
        return { message: "Parámetro 'type' no válido. Usa 1 para labels o 2 para values." };
    }
}

// --- CREACIÓN DE LABELS Y VALUES ---
async function PostLabelsValues(req) {
    try {
        const type = parseInt(req.req.query?.type);
        if (type === 1) {
            const labelItem = req.data.label;
            if (!labelItem) {
                throw { code: 400, message: "Se requiere un objeto 'label' en la solicitud" };
            }
            if (!labelItem.LABELID) {
                throw { code: 400, message: "Los campos LABELID son obligatorios para un label" };
            }
            const existingLabel = await ztlabels.findOne({ LABELID: labelItem.LABELID }).lean();
            if (existingLabel) {
                throw { code: 409, message: `Ya existe un label con LABELID: ${labelItem.LABELID}` };
            }
            const savedLabel = await ztlabels.create(labelItem);
            return {
                message: "Label insertado correctamente",
                success: true,
                label: labelItem
            };
        } else if (type === 2) {
            const valueItem = req.data.value;
            if (!valueItem) {
                throw { code: 400, message: "Se requiere un objeto 'value' en la solicitud" };
            }
            if (!valueItem.VALUEID || !valueItem.LABELID) {
                throw { code: 400, message: "Los campos VALUEID y LABELID son obligatorios para un value" };
            }
            const labelExists = await ztlabels.findOne({ LABELID: valueItem.LABELID }).lean();
            if (!labelExists) {
                throw { code: 404, message: `No existe un label con LABELID: ${valueItem.LABELID}` };
            }
            const existingValue = await ztvalues.findOne({ VALUEID: valueItem.VALUEID }).lean();
            if (existingValue) {
                throw { code: 409, message: `Ya existe un value con VALUEID: ${valueItem.VALUEID}` };
            }
            const savedValue = await ztvalues.create(valueItem);
            return {
                message: "Value insertado correctamente",
                success: true,
                value: valueItem
            };
        } else {
            throw { code: 400, message: "Parámetro 'type' no válido. Usa 1 para labels o 2 para values." };
        }
    } catch (error) {
        if (error.code) {
            throw error;
        }
        console.error('Error en PostLabelsValues:', error);
        throw { code: 500, message: "Error interno del servidor al procesar la solicitud" };
    }
}

// --- PATCH DE LABELS ---
async function patchLabels(req, id, updateData) {
    try {
        const existingLabel = await ztlabels.findOne({ LABELID: id }).lean();
        if (!existingLabel) {
            return { message: `No se encontró label con LABELID: ${id}` };
        }
        if (updateData.LABELID && updateData.LABELID !== id) {
            const labelWithNewId = await ztlabels.findOne({ LABELID: updateData.LABELID }).lean();
            if (labelWithNewId) {
                return {
                    message: "Ya existe un label con el nuevo LABELID especificado",
                    conflict: {
                        existingLabel: labelWithNewId.LABELID,
                        attemptedNewId: updateData.LABELID
                    }
                };
            }
        }
        const updatedLabel = await ztlabels.findOneAndUpdate(
            { LABELID: id },
            { $set: updateData },
            { new: true, lean: true }
        );
        return {
            message: "Label actualizado exitosamente",
            success: true,
        };
    } catch (error) {
        throw error;
    }
}

// --- PATCH DE VALUES ---
async function patchValues(req, id, updateData) {
    try {
        const valueToUpdate = await ztvalues.findOne({ VALUEID: id }).lean();
        if (!valueToUpdate) {
            throw {
                code: 400,
                message: `No se encontró value con VALUEID: ${id}`,
                error: "VALUE_NOT_FOUND"
            };
        }
        if (updateData.LABELID && updateData.LABELID !== valueToUpdate.LABELID) {
            throw {
                code: 400,
                message: "No está permitido modificar el LABELID de un value existente",
                error: "LABELID_MODIFICATION_NOT_ALLOWED"
            };
        }
        const updatedValue = await ztvalues.findOneAndUpdate(
            { VALUEID: id },
            { $set: updateData },
            { new: true, lean: true }
        );
        return {
            message: "Value actualizado exitosamente",
            success: true,
            value: updatedValue
        };
    } catch (error) {
        throw error;
    }
}

// --- ELIMINACIÓN DE LABELS Y VALUES ---
async function DeleteLabelsValues(req) {
    try {
        const type = parseInt(req.req.query?.type);
        const id = req.req.query?.id;
        const mode = req.req.query?.mode?.toLowerCase();
        const reguser = req.req.query?.reguser;

        if (!id) {
            throw { code: 400, message: "Se requiere el parámetro 'id' para borrar." };
        }
        if (!['logical', 'physical'].includes(mode)) {
            throw { code: 400, message: "Parámetro 'mode' no válido. Usa 'logical' o 'physical'." };
        }
        if (!reguser && mode === 'logical') {
            throw { code: 400, message: "Para el borrado lógico se requiere el parámetro 'reguser'." };
        }
        if (type === 1) {
            return await deleteLabel(id, mode, reguser);
        } else if (type === 2) {
            return await deleteValue(id, mode, reguser);
        } else {
            throw { code: 400, message: "Parámetro 'type' no válido. Usa 1 para labels o 2 para values." };
        }
    } catch (error) {
        throw error;
    }
}

// --- BORRADO DE LABELS ---
async function deleteLabel(id, mode, reguser) {
    try {
        const label = await ztlabels.findOne({ LABELID: id }).lean();
        if (!label) {
            throw { code: 404, message: `No se encontró label con LABELID: ${id}` };
        }
        if (mode === 'physical') {
            await ztlabels.deleteOne({ LABELID: id });
            return {
                code: 200,
                message: "Label borrado físicamente exitosamente",
                deletedLabel: label
            };
        }
        const newRegistry = {
            CURRENT: true,
            REGDATE: new Date(),
            REGTIME: new Date(),
            REGUSER: reguser
        };
        const updateObject = {
            DETAIL_ROW: {
                ACTIVED: false,
                DELETED: true,
                DETAIL_ROW_REG: [
                    ...(label.DETAIL_ROW?.DETAIL_ROW_REG
                        ?.filter(reg => typeof reg === 'object' && reg !== null)
                        ?.map(reg => ({ ...reg, CURRENT: false })) || []),
                    newRegistry
                ]
            }
        };
        const updatedLabel = await ztlabels.findOneAndUpdate(
            { LABELID: id },
            { $set: updateObject },
            { new: true, lean: true }
        );
        return {
            code: 200,
            message: "Label borrado lógicamente exitosamente",
            updatedLabel
        };
    } catch (error) {
        throw { code: 500, message: `Error al borrar label: ${error.message}` };
    }
}

// --- BORRADO DE VALUES ---
async function deleteValue(id, mode, reguser) {
    try {
        const value = await ztvalues.findOne({ VALUEID: id }).lean();
        if (!value) {
            throw { code: 404, message: `No se encontró value con VALUEID: ${id}` };
        }
        if (mode === 'physical') {
            await ztvalues.deleteOne({ VALUEID: id });
            return {
                code: 200,
                message: "Value borrado físicamente exitosamente",
                deletedValue: value
            };
        }
        const newRegistry = {
            CURRENT: true,
            REGDATE: new Date(),
            REGTIME: new Date(),
            REGUSER: reguser
        };
        const updateObject = {
            DETAIL_ROW: {
                ACTIVED: false,
                DELETED: true,
                DETAIL_ROW_REG: [
                    ...(value.DETAIL_ROW?.DETAIL_ROW_REG
                        ?.filter(reg => typeof reg === 'object' && reg !== null)
                        ?.map(reg => ({ ...reg, CURRENT: false })) || []),
                    newRegistry
                ]
            }
        };
        const updatedValue = await ztvalues.findOneAndUpdate(
            { VALUEID: id },
            { $set: updateObject },
            { new: true, lean: true }
        );
        return {
            code: 200,
            message: "Value borrado lógicamente exitosamente",
            updatedValue
        };
    } catch (error) {
        throw error;
    }
}

// --- CAMBIO LÓGICO DE ESTADO DE LABEL O VALUE ---
async function logicalLabelValue(req) {
    const { status, id, type } = req.req.query;
    try {
        if (!status || !id || !type) {
            throw { code: 400, success: false, message: 'Missing required parameters: status, id, or type' };
        }
        const isActivated = status;
        const updateData = {
            'DETAIL_ROW.ACTIVED': isActivated,
            $push: {
                'DETAIL_ROW.DETAIL_ROW_REG': {
                    CURRENT: true,
                    REGDATE: new Date(),
                    REGTIME: new Date(),
                    REGUSER: 'system'
                }
            }
        };
        if (type === '1') {
            await ztlabels.updateOne(
                { LABELID: id },
                { $set: { 'DETAIL_ROW.DETAIL_ROW_REG.$[].CURRENT': false } }
            );
            const result = await ztlabels.findOneAndUpdate(
                { LABELID: id },
                updateData,
                { new: true }
            );
            if (!result) {
                throw { code: 400, success: false, message: 'Label not found' };
            }
            return { code: 200, success: true, message: `Label ${status} successfully` };
        } else {
            await ztvalues.updateOne(
                { VALUEID: id },
                { $set: { 'DETAIL_ROW.DETAIL_ROW_REG.$[].CURRENT': false } }
            );
            const result = await ztvalues.findOneAndUpdate(
                { VALUEID: id },
                updateData,
                { new: true }
            );
            if (!result) {
                throw { code: 400, success: false, message: 'Value not found' };
            }
            return { code: 200, success: true, message: `Value ${status} successfully` };
        }
    } catch (error) {
        console.error('Error in logicalLabelValue:', error);
        throw {
            code: error.code || 500,
            success: false,
            message: error.message || 'Internal server error'
        };
    }
}

module.exports = { GetAllLabelsValues, DeleteLabelsValues, UpdateLabelsValues, PostLabelsValues, logicalLabelValue };