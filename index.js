const redux = require('redux')
const prompts = require('prompts')

//criadora de acao para realizar o vestibular

const realizarVestibular =(nome, cpf) => {
    const entre6E10 = Math.random() <= 0.7;
    const nota = entre6E10 ? 6 + Math.random() * 4 : Math.random() * 6;
    return {
        type: "REALIZAR_VESTIBULAR",
        payload:{
            nome, cpf, nota
        }
    }
}

// funcao criadora de acao

const realizarMatricula = (cpf, status) => {
    return {
        type: "REALIZAR_MATRICULA",
        payload:{
            cpf, status
        }
    }
}

//reducer manipula a seguinte lista
//[{cpf: 1, nome: "Ana", nota :10}, {cpf: 2, nome: "Joao", nota :10}]

const historicoVestibular =(historicoVestibularAtual = [], acao) => {
    if(acao.type === "REALIZAR_VESTIBULAR"){
        return[...historicoVestibularAtual, acao.payload]
    }

    return historicoVestibularAtual
}

//manipula 
//[{cpf: 1, status: M}, {cpf: 2, status: NM}]
const historicoMatriculas = (historicoMatriculaAtual = [], acao) =>{
    if(acao.type === "REALIZAR_VESTIBULAR"){
    return[...historicoMatriculaAtual, acao.payload]
    }

    return historicoMatriculaAtual
}

const todosOsReducers = redux.combineReducers({
    historicoMatriculas,
    historicoVestibular
})


const store = redux.createStore(todosOsReducers)

const main = async () => {
    const menu = "1-Realizar Vestibular\n2-Realizar Matricula\n3-Status\n4-Lista de Aprovados\n0-Sair"
    let response 
    do{
        response = await prompts({
            type: "number",
            name: "op",
            message: menu
        })

        switch (response.op){
            case 1: {
                const { nome} = await prompts({
                    type: 'text',
                     name: 'nome',
                    message: "Digite seu nome"
                 })

                const { cpf} = await prompts({
                    type: 'text',
                    name: 'cpf',
                     message: "Digite seu cpf"
                })

                const acao = realizarVestibular(nome, cpf)

                store.dispatch(acao)
                break;
            }
            case 2:
                const { cpf} = await prompts({
                    type: 'text',
                    name: 'cpf',
                     message: "Digite seu cpf"
                })

                const aprovado = store.getState().historicoVestibular.find(aluno => aluno.cpf === cpf && aluno.nota >=6)

                store.dispatch(realizarMatricula(cpf, aprovado ? "M" : "NM"))
                break;

        }

    }while (response.op !== 0)
}
