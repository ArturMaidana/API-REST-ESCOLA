import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { getAllAlunos, getAllTurmas } from "../services/alunos"; // Importe as funções BuscarAlunos e getAllTurmas

export function Graficos() {
  const [quantidadeAlunos, setQuantidadeAlunos] = useState(0); // Estado para armazenar a quantidade de alunos
  const [quantidadeTurmas, setQuantidadeTurmas] = useState(0); // Estado para armazenar a quantidade de turmas

  useEffect(() => {
    async function fetchData() {
      try {
        const alunosResponse = await getAllAlunos();
        const turmasResponse = await getAllTurmas();

        setQuantidadeAlunos(alunosResponse.data.length);
        setQuantidadeTurmas(turmasResponse.data.length);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchData();
  }, []);

  // Opções e séries dos gráficos
  const optionsAlunosPorGenero = {
    // Defina as opções para o gráfico de alunos por gênero
  };

  const seriesAlunosPorGenero = [
    {
      // Defina as séries para o gráfico de alunos por gênero
      name: 'Genero',
      data: [
        {x: 'Masculino,', y:10/*Quantidade de alunos Masculinos*/},
        {x: 'Feminino', y:10}
      ]
    },
  ];

  const optionsAlunosPorTurma = {
    // Defina as opções para o gráfico de alunos por turma
  };

  const seriesAlunosPorTurma = [
    {
      // Defina as séries para o gráfico de alunos por turma
    },
  ];

  const optionsTotalAlunos = {
    // Defina as opções para o gráfico de total de alunos
  };

  const seriesTotalAlunos = [
    {
      // Defina as séries para o gráfico de total de alunos
    },
  ];

  const optionsTotalTurmas = {
    // Defina as opções para o gráfico de total de turmas
  };

  const seriesTotalTurmas = [
    {
      // Defina as séries para o gráfico de total de turmas
    },
  ];

  const optionsTurmasPorTurno = {
    // Defina as opções para o gráfico de turmas por turno
  };

  const seriesTurmasPorTurno = [
    {
      // Defina as séries para o gráfico de turmas por turno
    },
  ];

  const optionsTurmasPorEnsino = {
    // Defina as opções para o gráfico de turmas por ensino
  };

  const seriesTurmasPorEnsino = [
    {
      // Defina as séries para o gráfico de turmas por ensino
    },
  ];

  const optionsTurmasPorEscola = {
    // Defina as opções para o gráfico de turmas por escola
  };

  const seriesTurmasPorEscola = [
    {
      // Defina as séries para o gráfico de turmas por escola
    },
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quantidade de Alunos</h5>
              <p className="card-text">{quantidadeAlunos}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quantidade de Turmas</h5>
              <p className="card-text">{quantidadeTurmas}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <Chart options={optionsAlunosPorGenero} series={seriesAlunosPorGenero} type="pie" width={500} />
        </div>
        <div className="col-md-6">
          <Chart options={optionsAlunosPorTurma} series={seriesAlunosPorTurma} type="bar" width={500} />
        </div>
        <div className="col-md-6">
          <Chart options={optionsTotalAlunos} series={seriesTotalAlunos} type="donut" width={500} />
        </div>
        <div className="col-md-6">
          <Chart options={optionsTotalTurmas} series={seriesTotalTurmas} type="donut" width={500} />
        </div>
        <div className="col-md-6">
          <Chart options={optionsTurmasPorTurno} series={seriesTurmasPorTurno} type="pie" width={500} />
        </div>
        <div className="col-md-6">
          <Chart options={optionsTurmasPorEnsino} series={seriesTurmasPorEnsino} type="bar" width={500} />
        </div>
        <div className="col-md-6">
          <Chart options={optionsTurmasPorEscola} series={seriesTurmasPorEscola} type="bar" width={500} />
        </div>
      </div>
    </div>
  );
}
