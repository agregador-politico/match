import { Opcao } from "./opcao";

export class Pergunta {
    label!: string;
    opcoes!: Opcao[];

    constructor() {
        this.opcoes = new Array();
        let aFavor = new Opcao('A favor', 1.0);
        let contra = new Opcao('Contra', 0.0);
        let naoSei = new Opcao('Não sei', 0.5);
        this.opcoes.push(aFavor);
        this.opcoes.push(contra);
        this.opcoes.push(naoSei);
    }
}
