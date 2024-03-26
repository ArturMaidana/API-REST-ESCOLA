// Importações de Bibliotecas e Frameworks
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardActions, CardContent,Button,  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

// Importações de Componentes
import { MetadataText } from "./MetadataText";
import { HeaderText } from "./HeaderText";
import { SupportingText } from "./SupportingText";
import { InputText } from "./InputText";
import { ButtonEditItem } from "./ButtonEditItem";
import { ButtonDeleteItem } from "./ButtonDeleteItem";
import { jsPDF } from 'jspdf'; // Importa o jsPDF para geração de PDF
import { ButtonCancel } from "./ButtonCancel";
import { ButtonConfirm } from "./ButtonConfirm";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import { CircularProgressButtonStyled } from "../components/CircularProgressButtonStyled";

import { BuscarAlunos } from "../services/alunos";
// Importações de Serviços
import { getUserInformation, isSystemCoordinator } from "../utils/userUtils";

export function Turma(props) {
  // Estados
  const [userInformation, setUserInformation] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedturmaName, setUpdatedturmaName] = useState("");
  const [updatedturmaEnsino, setUpdatedturmaEnsino] = useState("");
  const [updatedturmaTurno, setUpdatedturmaTurno] = useState("");
  const [updatedturmaCoordenador, setUpdatedturmaCoordenador] = useState("");
  const [updatedturmaEscola, setUpdatedturmaEscola] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  //
  const openEditModal = () => {
    setIsUpdated(true);
    setUpdatedturmaName(props.turma.name);
    setUpdatedturmaEnsino(props.turma.ensino);
    setUpdatedturmaTurno(props.turma.turno);
    setUpdatedturmaCoordenador(props.turma.coordenador);
    setUpdatedturmaEscola(props.turma.escola);
  };
  // Efeito para atualizar os dados do cargo quando houver alterações
  useEffect(() => {
    setUpdatedturmaName(props.turma.name);
    setUpdatedturmaEnsino(props.turma.ensino);
    setUpdatedturmaTurno(props.turma.turno);
    setUpdatedturmaCoordenador(props.turma.coordenador);
    setUpdatedturmaEscola(props.turma.escola);
  }, [props.turma.name, props.turma.ensino, props.turma.turno, props.turma.coordenador, props.turma.escola]);

  const generatePDF = async () => {
    try {
        console.log('Nome da Turma:', props.turma.name);

        // Filtra alunos por turma
        const filtroPorTurma = { turma: props.turma.name };
        const response = await BuscarAlunos(filtroPorTurma);

        console.log('Resposta da API:', response);

        if (response.data && Array.isArray(response.data)) {
            const alunosMatriculados = response.data;

            const doc = new jsPDF();

            // Adiciona informações da turma no PDF
            doc.text('Gestão de Turmas', 80, 10);
            doc.text(`Nome da Turma: ${props.turma.name}`, 10, 20);
            doc.text(`Ensino: ${props.turma.ensino}`, 90, 20);
            doc.text(`Carga Horaria: ${props.turma.coordenador}`, 140, 20);
            doc.text(`Data de Início: ${props.turma.escola}`, 10, 30);
            doc.text('Alunos Matriculados', 80, 50);
            
            // Adiciona os detalhes dos alunos matriculados em uma tabela
            const tableData = alunosMatriculados.map((aluno) => [
                aluno.id,
                aluno.name,
            ]);

            doc.autoTable({
                head: [['Matrícula', 'Nome']],
                body: tableData,
                startY: 60, // Posição inicial da tabela
            });

            doc.save(`turma_${props.turma.name}.pdf`);
        } else {
            console.error('Resposta inválida da função getAlunos');
        }
    } catch (error) {
        console.error(error);
    }
};
  //
  useEffect(() => {
    async function fetchUserInformation() {
      const result = await getUserInformation();
      setUserInformation(result);
    }
    fetchUserInformation();
  }, []);

  // Hooks de formulário para validação
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  // Funções assíncronas
  async function editTurma(data) {
    try {
      setIsUpdating(true);
      await props.editTurma({
        ...data,
        id: props.turma.id,
      });
      setIsUpdated(false);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }

  async function removeTurma(data) {
    try {
      setIsDeleting(true);
      await props.removeTurma({
        ...data,
        id: props.turma.id,
      });
      setIsDeleted(false);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Card sx={{ minWidth: 275, mb: 2, p: 1 }}>
        <CardContent>
          <MetadataText props={`ID ${props.turma.id}`} />
          <HeaderText props={props.turma.name} />
          <SupportingText props={props.turma.ensino} />
        </CardContent>
        {userInformation && isSystemCoordinator(userInformation) && (
          <CardActions sx={{ ml: 1 }}>
            <ButtonEditItem onClick={openEditModal} />
            <ButtonDeleteItem onClick={() => setIsDeleted(true)} />
            <Button onClick={generatePDF}><ArrowCircleDownIcon/></Button>
          </CardActions>
        )}
      </Card>

      {/* Modal de edição */}
      <Dialog open={isUpdated} onClose={() => setIsUpdated(false)} fullWidth>
        <form onSubmit={handleSubmit(editTurma)}>
          <DialogTitle>
            {" "}
            <HeaderText props={`Ajustar detalhes de "${props.turma.name}"`} />
          </DialogTitle>

          <DialogContent>
            <InputText
              name={"turmaName"}
              label={"Nome da Turma"}
              type={"text"}
              id={"turmaName"}
              value={updatedturmaName}
              error={errors.turmaName}
              helperText={errors.turmaName && errors.turmaName.message}
              onChange={(e) => setUpdatedturmaName(e.target.value)}
              inputProps={{
                ...register("turmaName", {
                  required: {
                    value: true,
                    message: "Informe um nome para a turma.",
                  },
                }),
              }}
            />

            <InputText
              name={"turmaEnsino"}
              label={"Tipo de Ensino"}
              type={"text"}
              id={"turmaEnsino"}
              value={updatedturmaEnsino}
              error={errors.turmaEnsino}
              helperText={errors.turmaEnsino && errors.turmaEnsino.message}
              onChange={(e) => setUpdatedturmaEnsino(e.target.value)}
              inputProps={{
                ...register("turmaEnsino", {
                  required: {
                    value: true,
                    message: "Informe o tipo de ensino.",
                  },
                }),
              }}
            />

            <InputText
              name={"turmaTurno"}
              label={"Turno"}
              type={"text"}
              id={"turmaTurno"}
              value={updatedturmaTurno}
              error={errors.turmaTurno}
              helperText={errors.turmaTurno && errors.turmaTurno.message}
              onChange={(e) => setUpdatedturmaTurno(e.target.value)}
              inputProps={{
                ...register("turmaTurno", {
                  required: {
                    value: true,
                    message: "Informe um turno.",
                  },
                }),
              }}
            />

            <InputText
              name={"turmaCoordenador"}
              label={"Coordenador Responsável"}
              type={"text"}
              id={"turmaCoordenador"}
              value={updatedturmaCoordenador}
              error={errors.turmaCoordenador}
              helperText={errors.turmaCoordenador && errors.turmaCoordenador.message}
              onChange={(e) => setUpdatedturmaCoordenador(e.target.value)}
              inputProps={{
                ...register("turmaCoordenador", {
                  required: {
                    value: true,
                    message: "Informe o nome do responsável pela turma.",
                  },
                }),
              }}
            />

            <InputText
              name={"turmaEscola"}
              label={"Nome da Escola"}
              type={"text"}
              id={"turmaEscola"}
              value={updatedturmaEscola}
              error={errors.turmaEscola}
              helperText={errors.turmaEscola && errors.turmaEscola.message}
              onChange={(e) => setUpdatedturmaEscola(e.target.value)}
              inputProps={{
                ...register("turmaEscola", {
                  required: {
                    value: true,
                    message: "Informe o nome da escola.",
                  },
                }),
              }}
            />
          </DialogContent>

          <DialogActions sx={{ mb: 3, mr: 2 }}>
            <ButtonCancel onClick={() => setIsUpdated(false)} />
            {isUpdating ? <ButtonConfirm props={<CircularProgressButtonStyled />} /> : <ButtonConfirm type={"submit"} props={"Atualizar Informações"} />}
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal confirmando a deleção do dado */}
      <Dialog open={isDeleted} onClose={() => setIsDeleted(false)} maxWidth="xs" sx={{ textAlign: "center" }}>
        <DialogTitle>Você tem certeza?</DialogTitle>

        <DialogContent>
          <DialogContentText>Você realmente deseja excluir este dado? Esse processo não pode ser desfeito.</DialogContentText>
        </DialogContent>

        <DialogActions sx={{ mb: 3, justifyContent: "center" }}>
          <ButtonCancel onClick={() => setIsDeleted(false)} props={"Não, quero cancelar"} />

          {isDeleting ? (
            <ButtonConfirm color={"error"} props={<CircularProgressButtonStyled />} />
          ) : (
            <ButtonConfirm color={"error"} type={"submit"} onClick={() => removeTurma()} props={"Sim, desejo apagar"} />
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
