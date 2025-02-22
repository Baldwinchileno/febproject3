// src/app/features/inventario/models/tipos.model.ts
export enum TipoMovimiento {
    ENTRADA = 'ENTRADA',
    SALIDA = 'SALIDA',
    TRASPASO = 'TRASPASO',
    AJUSTE = 'AJUSTE'
  }
  
  export enum TipoAlerta {
    STOCK_BAJO = 'STOCK_BAJO',
    STOCK_CRITICO = 'STOCK_CRITICO',
    VENCIMIENTO_PROXIMO = 'VENCIMIENTO_PROXIMO'
  }
  
  export enum UnidadMedida {
    UNIDAD = 'UNIDAD',
    KILO = 'KILO',
    GRAMO = 'GRAMO'
  }
  
  export enum CategoriaProducto {
    CARNE_VACUNO = 'CARNE_VACUNO',
    CARNE_CERDO = 'CARNE_CERDO',
    EMBUTIDOS = 'EMBUTIDOS',
    AVES = 'AVES',
    PREPARADOS = 'PREPARADOS'
  }
  
  export enum Ubicacion {
    SALA_PROCESOS = 'SALA_PROCESOS',
    CAMARA_CONGELADOS = 'CAMARA_CONGELADOS',
    LOCAL_MINORISTA = 'LOCAL_MINORISTA'
  }

  export enum SubCategoriaCerdo {
    CHULETA = 'CHULETA',
    COSTILLA = 'COSTILLA',
    LOMO = 'LOMO',
    PATA = 'PATA',
    PERNIL = 'PERNIL'
  }
  
  export enum SubCategoriaVacuno {
    ASADO = 'ASADO',
    BIFE = 'BIFE',
    MOLIDA = 'MOLIDA',
    OSOBUCO = 'OSOBUCO',
    LOMO = 'LOMO'
  }
  
  export enum SubCategoriaEmbutidos {
    CHORIZO = 'CHORIZO',
    LONGANIZA = 'LONGANIZA',
    SALCHICHA = 'SALCHICHA',
    MORCILLA = 'MORCILLA'
  }
  
  export type SubCategoria = SubCategoriaCerdo | SubCategoriaVacuno | SubCategoriaEmbutidos;