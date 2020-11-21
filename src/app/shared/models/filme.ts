//quando coloca a interrogação é opcional
//interface para garantir que sempre haja os mesmo dados
export interface Filme {
    id?: number;
    titulo: string;
    urlFoto?: string;
    dtLancamento: Date;
    descricao?: string;
    nota: number;
    urlIMDb: string;
    genero: string;
}
