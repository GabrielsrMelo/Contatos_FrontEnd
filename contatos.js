const URL = 'https://bakcend-fecaf-render.onrender.com/contatos'

export async function getContatos() {
    const response = await fetch (URL)
    if (!response.ok) throw new Error('Erro ao buscar contatos')    
    return response.json()
    
}
export async function postContato(contato) {
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(contato)


    }
    const response = await fetch(URL, options)
    if(!response.ok) throw new Error ('Erro ao criar um novo contato!')
    return response.json()

}

export async function putContato(id, contato){
    const options = {
        method:'PUT',
        headers:{
            'content-type': 'application/json'
        },
        body: JSON.stringify(contato)
    }

    const response = await fetch(`${URL}/${id}`, options)

    if(!response.ok) throw new Error ('Erro ao atualizar contato')

    return response.json()
}

export async function deleteContato(id){
    const options = {
        method: 'DELETE'
    }
    
    const response = await fetch (`${URL}/${id}`, options)

    if(!response.ok) throw new Error('Erro ao deletar contato');
    
    return true
}
