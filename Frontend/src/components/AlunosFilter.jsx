import React, { useState } from "react";

export function AlunosFilter({ onFilter }) {
    // Define um estado para os filtros de nome de alunos e turno
    const [filtro, setFiltro] = useState({
        name: "",
        genero: "",
    });

    // Função para lidar com as mudanças nos campos de filtro
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        // Atualiza o estado do filtro com o novo valor
        setFiltro({ ...filtro, [name]: value });
    };

    // Função para acionar o filtro quando o botão "Filtrar" é clicado
    const handleFilterClick = () => {
        // Chama a função 'onFilter' passando o objeto 'filtro' como argumento
        onFilter(filtro);
    };

    return (
        <div className="mb-4">
            <div className="d-flex justify-content-center">
                <div className="me-4">
                    <input
                        type="text"
                        className="form-control form-control-md"
                        id="name"
                        name="name"
                        placeholder="Buscar..."
                        value={filtro.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="me-2">
                    <select
                        className="form-select form-select-md"
                        id="genero"
                        name="genero"
                        value={filtro.genero}
                        onChange={handleInputChange}
                    >
                        <option value="">Todos</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                    </select>
                </div>
                <button
                    className="btn btn-primary btn-md"
                    onClick={handleFilterClick}
                >
                    Filtrar
                </button>{" "}
                {/* Alterado para btn-md */}
            </div>
        </div>
    );
}