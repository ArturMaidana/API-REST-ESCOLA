import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import { getAllAlunos, getAllTurmas } from "../services/alunos";

export function Graficos() {
  const [qtdeAlunos, setQtdeAlunos] = useState(0);
  const [qtdeTurmas, setQtdeTurmas] = useState(0);
  const [generoCounts, setGeneroCounts] = useState({});

  async function fetchQuantidadeAlunos() {
    try {
      const response = await getAllAlunos();
      setQtdeAlunos(response.alunos.length);

      const generoCounts = { Masculino: 0, Feminino: 0 };
      response.alunos.forEach(aluno => {
        if (aluno.genero === "Masculino") {
          generoCounts.Masculino++;
        } else if (aluno.genero === "Feminino") {
          generoCounts.Feminino++;
        }
      });
      setGeneroCounts(generoCounts);
    } catch (error) {
      console.error("Erro ao buscar quantidade de alunos:", error);
    }
  }

  async function fetchQuantidadeTurmas() {
    try {
      const response = await getAllTurmas();
      setQtdeTurmas(response.turmas.length);
    } catch (error) {
      console.error("Erro ao buscar quantidade de turmas:", error);
    }
  }

  useEffect(() => {
    fetchQuantidadeAlunos();
    fetchQuantidadeTurmas();

    // Renderizar gráficos ApexCharts após buscar os dados
    renderCharts();
  }, [])

  function renderCharts() {
    // Sparklines
   
    // Line Chart
    renderLineChart("line-adwords", ["Music", "Photos", "Files"], [
      [1, 15, 26, 20, 33, 27],
      [3, 33, 21, 42, 19, 32],
      [0, 39, 52, 11, 29, 43]
    ]);

    // Radial Bar Chart
    renderRadialChart("radialBarBottom", [71, 63, 77], ['April', 'Junho', 'julho']);

    // Bar Chart
    renderBarChart("barchart", ["2011 Q1", "2011 Q2", "2011 Q3", "2011 Q4", "2012 Q1", "2012 Q2", "2012 Q3", "2012 Q4"], [
      [14, 25, 21, 17, 12, 13, 11, 19],
      [13, 23, 20, 8, 13, 27, 33, 12],
      [11, 17, 15, 15, 21, 14, 15, 13]
    ]);

    // Area Chart
    renderAreaChart("areachart", ["2011 Q1", "2011 Q2", "2011 Q3", "2011 Q4", "2012 Q1", "2012 Q2"], [
      [11, 15, 26, 20, 33, 27],
      [32, 33, 21, 42, 19, 32],
      [20, 39, 52, 11, 29, 43]
    ]);
  }

  
  function renderLineChart(id, categories, seriesData) {
    new ApexCharts(document.querySelector(`#${id}`), {
      chart: {
        height: 328,
        type: 'line',
        zoom: {
          enabled: false
        },
        dropShadow: {
          enabled: true,
          top: 3,
          left: 2,
          blur: 4,
          opacity: 1,
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      series: seriesData.map((data, index) => ({ name: categories[index], data })),
      title: {
        text: 'Media',
        align: 'left',
        offsetY: 25,
        offsetX: 20
      },
      subtitle: {
        text: 'Statistics',
        offsetY: 55,
        offsetX: 20
      },
      markers: {
        size: 6,
        strokeWidth: 0,
        hover: {
          size: 9
        }
      },
      grid: {
        show: true,
        padding: {
          bottom: 0
        }
      },
      labels: ['01/15/2002', '01/16/2002', '01/17/2002', '01/18/2002', '01/19/2002', '01/20/2002'],
      xaxis: {
        tooltip: {
          enabled: false
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        offsetY: -20
      }
    }).render();
  }

  

  function renderRadialChart(id, data, labels) {
    new ApexCharts(document.querySelector(`#${id}`), {
      chart: {
        type: 'radialBar',
        height: 350,
        width: 380,
      },
      plotOptions: {
        radialBar: {
          size: undefined,
          inverseOrder: true,
          hollow: {
            margin: 5,
            size: '48%',
            background: 'transparent',

          },
          track: {
            show: false,
          },
          startAngle: -180,
          endAngle: 180

        },
      },
      stroke: {
        lineCap: 'round'
      },
      series: data,
      labels,
      legend: {
        show: true,
        floating: true,
        position: 'right',
        offsetX: 70,
        offsetY: 240
      },
    }).render();
  }

  function renderBarChart(id, categories, seriesData) {
    new ApexCharts(document.querySelector(`#${id}`), {
      chart: {
        height: 380,
        type: 'bar',
        stacked: true,
      },
      plotOptions: {
        bar: {
          columnWidth: '30%',
          horizontal: false,
        },
      },
      series: seriesData.map((data, index) => ({ name: `PRODUCT ${String.fromCharCode(65 + index)}`, data })),
      xaxis: {
        categories,
      },
      fill: {
        opacity: 1
      },
    }).render();
  }

  function renderAreaChart(id, categories, seriesData) {
    new ApexCharts(document.querySelector(`#${id}`), {
      chart: {
        height: 380,
        type: 'area',
        stacked: false,
      },
      stroke: {
        curve: 'straight'
      },
      series: seriesData.map((data, index) => ({ name: `Series ${index + 1}`, data })),
      xaxis: {
        categories,
      },
      tooltip: {
        followCursor: true
      },
      fill: {
        opacity: 1,
      },
    }).render();
  }

  return (
    <div>
      {/* Renderização de outros componentes... */}
      
      <div id="line-adwords"></div>
      <div id="barchart"></div>
      <div id="areachart"></div>
      <div id="radialBarBottom"></div>

    </div>
  );
}
