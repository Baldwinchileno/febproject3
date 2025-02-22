export interface InventarioProducto {
    codigo: string;
    descripcion: string;
    marca: string;
    unidades: number;
    kilos: number;
    ubicacion: Ubicacion;
    fechaCompra: Date;
    fechaRegistro: Date;
    fechaVencimiento?: Date;
    categoria: string;
    subCategoria: string;
}