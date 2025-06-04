// src/routes/sec-labelsvalues-router.cds



using {sec as mysec} from '../models/sec-esecurity';

// SERVICIO DE CATÁLOGOS (LABELS Y VALUES)
@impl: 'src/api/controllers/sec-labelsvalues-controller.js'
service catalogos @(path:'/api/catalogos') {

    // Proyecciones de entidades principales
    entity labels  as projection on mysec.labels;
    entity label   as projection on mysec.label;
    entity values  as projection on mysec.values;
    entity value_  as projection on mysec.value;

    // FUNCIONES Y ACCIONES DISPONIBLES

    @Core.Description: 'Get all labels'
    @path: 'getAllLabels'
    function getAllLabels() 
        returns array of labels;

    // Acción para crear un nuevo catálogo o valor
    @Core.Description: 'Add value to a label'
    @path: 'createLabel'
    action createLabel(label: labels, value: values) 
        returns {
            success: Boolean;
            message: String;
            value: {};
        };

    // Acción para actualizar un catálogo y un valor
    @Core.Description: 'Update a label and value'
    @path: 'updateLabel'
    action updateLabel(label: label, value: value_)
        returns {
            success: Boolean;
            message: String;
            value: {};
        };

    // Función para eliminar un catálogo o un valor
    @Core.Description: 'Delete a label or value'
    @path: 'deleteLabelOrValue'
    function deleteLabelOrValue() 
        returns array of labels;

    // Función para cambio lógico de estado en un catálogo o valor
    @Core.Description: 'Delete a label or value'
    @path: 'logicalLabelValue'
    function logicalLabelValue() 
        returns {};
};
