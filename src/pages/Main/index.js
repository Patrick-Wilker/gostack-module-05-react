import React, {Component} from 'react'
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa'
import {Link} from 'react-router-dom'

import api from '../../services/api'

import Container from '../../components/Container/index'
import { Form, SubmitButton, List } from './styles'

export default class Main extends Component{

    state = {
        newRepo: '',
        repositories: [],
        loading: false,
        error: false
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

        this.setState({loading: true, error: false})

        const {newRepo, repositories} = this.state



        let response

        try{
            repositories.map(repository => {
                if(repository.name == newRepo){
                    this.setState({
                        newRepo: '',
                        repositories: [...repositories],
                        loading: false,
                        error: true,
                    })

                    throw new Error('Repositório duplicado')
                }
            })

            response =  await api.get(`/repos/${newRepo}`)

        }catch(err){
            this.setState({
                newRepo: '',
                repositories: [...repositories],
                loading: false,
                error: true,
            })
            return response
        }

        let data

        data = {
            name: response.data.full_name,
        }

        this.setState({
            newRepo: '',
            repositories: [...repositories, data],
            loading: false,
            error: false,
        })

    }

    render (){
        const {newRepo, repositories ,loading, error} = this.state

        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositórios
                </h1>

                <Form onSubmit={this.handleSubmit} error={error}>
                    <input
                        type="text"
                        placeholder="Adicionar repositório"
                        value={newRepo}
                        onChange={this.handleInputChange}
                    />

                    <SubmitButton loading={loading} error={error}>

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
                            <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link>
                        </li>
                    ))}
                </List>

            </Container>
        )
    }
}

/**
 * encodeURIComponent() serve para nao ler a barra como barra
 */
