namespace sec;


// ENTIDADES DE USUARIOS Y SEGURIDAD


entity users {
    key USERID   : String;
        USERNAME : String;
        PASSWORD : String;
}


// ENTIDADES DE ETIQUETAS (LABELS)


entity labels {
    key LABELID    : String;
        COMPANYID   : String;
        CEDIID      : String;
        LABEL       : String;
        INDEX       : String;
        COLLECTION  : String;
        SECTION     : String;
        SEQUENCE    : Integer;
        IMAGE       : String;
        DESCRIPTION : String;
        DETAIL_ROW  : Composition of one {
            ACTIVED   : Boolean default true;
            DELETED   : Boolean default false;
            DETAIL_ROW_REG : Composition of many {
                CURRENT  : Boolean;
                REGDATE  : Timestamp;
                REGTIME  : Timestamp;
                REGUSER  : String;
            };
        };
}

// Variante simplificada de etiqueta
entity label {
    key LABELID     : String;
        COMPANYID   : String;
        CEDIID      : String;
        LABEL       : String;
        INDEX       : String;
        COLLECTION  : String;
        SECTION     : String;
        SEQUENCE    : Integer;
        IMAGE       : String;
        DESCRIPTION : String;
        ACTIVED     : Boolean default true;
        REGUSER     : String;
}


// ENTIDADES DE VALORES (VALUES)

entity values {
    key VALUEID     : String;
        COMPANYID   : Integer;
        CEDIID      : Integer;
        LABELID     : String;
        VALUEPAID   : String; // Valor padre (si es jerárquico)
        VALUE       : String;
        ALIAS       : String;
        SEQUENCE    : Integer;
        IMAGE       : String;
        DESCRIPTION : String;
        DETAIL_ROW  : Composition of one {
            ACTIVED   : Boolean default true;
            DELETED   : Boolean default false;
            DETAIL_ROW_REG : Composition of many {
                CURRENT  : Boolean;
                REGDATE  : Timestamp;
                REGTIME  : Timestamp;
                REGUSER  : String;
            };
        };
}

// Variante simplificada de valor
entity value {
    key VALUEID     : String;
        COMPANYID   : String;
        CEDIID      : String;
        LABELID     : String;
        VALUEPAID   : String; // Valor padre (si es jerárquico)
        VALUE       : String;
        ALIAS       : String;
        SEQUENCE    : Integer;
        IMAGE       : String;
        DESCRIPTION : String;
        ACTIVED     : Boolean default true;
        REGUSER     : String;
}