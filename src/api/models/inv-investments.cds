namespace inv;


// ENTIDADES PRINCIPALES

// Historial de precios de activos
entity priceshistory {
    key DATE   : DateTime;
        OPEN   : Decimal;
        HIGH   : Decimal;
        LOW    : Decimal;
        CLOSE  : Decimal;
        VOLUME : Decimal;
}

// Estrategias de inversión disponibles
entity strategies {
    key ID          : Integer;
        NAME        : String;
        DESCRIPTION : String;
        TIME        : Time;
        RISK        : Double;
}


// ENTIDAD DE SIMULACIÓN

// Simulación de estrategias de inversión
entity SIMULATION {
    key SIMULATIONID   : String;
        USERID         : String;
        STRATEGYID     : String;
        SIMULATIONNAME : String;
        SYMBOL         : String;
        STARTDATE      : String;
        ENDDATE        : String;
        AMOUNT         : Decimal(10, 2);
        SPECS          : array of INDICATOR;
        SIGNALS        : array of SIGNAL;
        SUMMARY        : SUMMARY;
        CHART_DATA     : array of CHART_DATA;
        DETAIL_ROW     : array of DETAIL_ROW;
}


// TIPOS AUXILIARES


// Señales de compra/venta generadas en la simulación
type SIGNAL {
    DATE      : String;
    TYPE      : String;
    PRICE     : Decimal(10, 2);
    REASONING : String;
    SHARES    : Decimal(18, 15);
}

// Resumen de resultados de la simulación
type SUMMARY {
    TOTAL_BOUGHT_UNITS : Decimal(18, 4);
    TOTAL_SOLD_UNITS   : Decimal(18, 4);
    REMAINING_UNITS    : Decimal(18, 4);
    FINAL_CASH         : Decimal(10, 2);
    FINAL_VALUE        : Decimal(10, 2);
    FINAL_BALANCE      : Decimal(10, 2);
    REAL_PROFIT        : Decimal(10, 2);
    PERCENTAGE_RETURN  : Decimal(18, 15);
}

// Datos para gráficos de simulación
type CHART_DATA {
    DATE       : String;
    OPEN       : Decimal(10, 2);
    HIGH       : Decimal(10, 2);
    LOW        : Decimal(10, 2);
    CLOSE      : Decimal(10, 2);
    VOLUME     : Integer;
    INDICATORS : array of INDICATOR;
}

// Indicadores técnicos asociados a los datos de gráfico
type INDICATOR {
    INDICATOR : String;
    VALUE     : Decimal(18, 15);
}

// Detalle de registros de la simulación
type DETAIL_ROW {
    ACTIVED        : Boolean;
    DELETED        : Boolean;
    DETAIL_ROW_REG : array of DETAIL_ROW_REG;
}

// Registro individual dentro del detalle
type DETAIL_ROW_REG {
    CURRENT : Boolean;
    REGDATE : DateTime;
    REGTIME : String;
    REGUSER : String;
}


// ENTIDAD DE SÍMBOLOS

// Información de símbolos disponibles para inversión
entity symbols {
    key   SYMBOL         : String;
          NAME           : String;
          EXCHANGE       : String;
          ASSETTYPE      : String;
          IPODATE        : String;
          DELISTINGDATE  : String;
          STATUS         : String;
}