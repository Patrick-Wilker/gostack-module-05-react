import React, {Component} from 'react'
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa'

import api from '../../services/api'

import { Container, Form, SubmitButton, List } from './styles'

export default class Main extends Component{

    state = {
        newRepo: '',
        repositories: [],
        loading: false,
    }

    componentDidMount(){
        const repositories = localStorage.getItem('repositories')

        if(repositories){
            this.setState({repositories: JSON.parse(repositories)})
        }
    }

    componentDidUpdate(_, prevState){
        const {repositories} = this.state

        if(prevState.repositories != repositories){
            localStorage.setItem('repositories', JSON.stringify(repositories))
        }
    }

    handleInputChange = e =>{
        this.setState({newRepo: e.target.value})
    }

    handleSubmit = async e => {
        e.preventDefault()

        this.setState({loading: true})

        const {newRepo, repositories} = this.state

        let response

        await api.get(`/repos/${newRepo}`, {validateStatus: () => true}).then(function (res) {
            console.log(res.status);
            response = res

        })

        if(response.status != 200){
            alert('Não foi possível encontrar esse repositório. Certifique-se de estar nos seguintes padrões User/Repository.')
            this.setState({
                newRepo: '',
                repositories: [...repositories],
                loading: false,
            })
            return
        }

        let data

        data = {
            name: response.data.full_name,
        }

        this.setState({
            newRepo: '',
            repositories: [...repositories, data],
            loading: false,
        })

    }

    render (){
        const {newRepo, repositories ,loading} = this.state

        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositórios
                </h1>

                <Form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Adicionar repositório"
                        value={newRepo}
                        onChange={this.handleInputChange}
                    />

                    <SubmitButton loading={loading}>

                        { loading ? (
                            <FaSpinner color="#FFF" size={14} />
                        )  : (
                            <FaPlus color="#FFF" size={14}/>
                        )  }

                    </SubmitButton>
                </Form>

                <List>
                    {repositories && repositories.map(repository => (
                        <li key={repository.name}>
                            <span>{repository.name}</span>
                            <a href="">Detalhes</a>
                        </li>
                    ))}
                </List>

            </Container>
        )
    }
}

