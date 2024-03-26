// Importações de Bibliotecas e Frameworks
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardActions, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

// Importações de Componentes
import { MetadataText } from "./MetadataText";
import { HeaderText } from "./HeaderText";
import { SupportingText } from "./SupportingText";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';


import { InputText } from "./InputText";
import { ButtonEditItem } from "./ButtonEditItem";
import { ButtonDeleteItem } from "./ButtonDeleteItem";
import { ButtonCancel } from "./ButtonCancel";
import { jsPDF } from 'jspdf'; // Importa a biblioteca jsPDF para geração de PDF
import { ButtonConfirm } from "./ButtonConfirm";
import { LogoFeminino, LogoMasculino } from "./Index";
import { CircularProgressButtonStyled } from "../components/CircularProgressButtonStyled";
// Importações de Serviços
import { getUserInformation, isSystemCoordinator } from "../utils/userUtils";
import { getAllTurmas } from "../services/turmas";

export function Aluno(props) {
  // Estados
  const [userInformation, setUserInformation] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedalunosName, setUpdatedalunosName] = useState("");
  const [updatedalunosGenero, setUpdatedalunosGenero] = useState("");
  const [updatedalunosResponsavel, setUpdatedalunosResponsavel] = useState("");
  const [updatedalunosTelefone, setUpdatedalunosTelefone] = useState("");
  const [updatedalunosTurma, setUpdatedalunosTurma] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [turmas, setTurmas] = useState([]);

 
  //
  const openEditModal = () => {
    setIsUpdated(true);
    setUpdatedalunosName(props.aluno.name);
    setUpdatedalunosGenero(props.aluno.genero);
    setUpdatedalunosResponsavel(props.aluno.responsavel);
    setUpdatedalunosTelefone(props.aluno.telefone);
    setUpdatedalunosTurma(props.aluno.turma);
  };
  // Efeito para atualizar os dados do cargo quando houver alterações
  useEffect(() => {
    setUpdatedalunosName(props.aluno.name);
    setUpdatedalunosGenero(props.aluno.genero);
    setUpdatedalunosResponsavel(props.aluno.responsavel);
    setUpdatedalunosTelefone(props.aluno.telefone);
    setUpdatedalunosTurma(props.aluno.turma);
  }, [props.aluno.name, props.aluno.genero, props.aluno.responsavel, props.aluno.telefone, props.aluno.turma]);

  const generatePDF = () => {

    

    const doc = new jsPDF();

    // Adicione os detalhes do aluno ao PDF
    doc.text('Gestão de Turmas', 80, 10);
    doc.text('Dados do Aluno', 10, 30);
    doc.text(`Nome: ${props.aluno.name}`, 10, 40);
    doc.text(`Gênero: ${props.aluno.genero}`, 80, 40);
    doc.text(`Responsável: ${props.aluno.responsavel}`, 10, 50);
    doc.text(`Telefone: ${props.aluno.telefone}`, 80, 50);
    doc.text(`Turma: ${props.aluno.turma}`, 140, 40);

    // Carregue o modelo de boletim diretamente como uma imagem

    // Salve o PDF com um nome específico
    doc.save(`aluno_${props.aluno.name}.pdf`);
};
  useEffect(() => {
    async function fetchUserInformation() {
      const result = await getUserInformation();
      setUserInformation(result);
    }
    fetchUserInformation();
  }, []);

  useEffect(() => {
    async function fetchTurmas() {
      try {
        const result = await getAllTurmas();
        setTurmas(result.turmas);
      } catch (error) {
        console.error("Erro ao obter turmas:", error);
      }
    }
    fetchTurmas();
  }, []);

  // Hooks de formulário para validação
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  // Funções assíncronas
  async function editAlunos(data) {
    console.log(data);
    try {
      setIsUpdating(true);
      await props.editAlunos({
        ...data,
        id: props.aluno.id,
      });
      setIsUpdated(false);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }

  async function removeAlunos(data) {
    try {
      setIsDeleting(true);
      await props.removeAlunos({
        ...data,
        id: props.aluno.id,
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
<Card sx={{ width: 250, mb: 3, p: 1, margin: '5px 5px' }}>
  <MetadataText props={`ID ${props.aluno.id}`} />

  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      {/* Adicionei um wrapper com flex para centralizar a imagem e o texto */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {props.aluno.genero === "Feminino" ? <LogoFeminino style={{ width: '100px', height: '100px' }} /> : <LogoMasculino style={{ width: '100px', height: '100px' }} />}
        {/* Adicionei os textos abaixo da imagem */}
        <HeaderText props={props.aluno.name} />
        <SupportingText props={props.aluno.turma} />
      </div>
    </div>
  </CardContent>
  {userInformation && isSystemCoordinator(userInformation) && (
    <CardActions sx={{ ml: 2 }}>
      <ButtonEditItem onClick={openEditModal} />
      <ButtonDeleteItem onClick={() => setIsDeleted(true)} />
      <Button onClick={generatePDF}><ArrowCircleDownIcon /></Button>
    </CardActions>
  )}
</Card>


      {/* Modal de edição */}
      <Dialog open={isUpdated} onClose={() => setIsUpdated(false)} fullWidth>
        <form  onSubmit={handleSubmit(editAlunos)}>
          <DialogTitle>
            {" "}
            <HeaderText props={`Ajustar detalhes de "${props.aluno.name}"`} />
          </DialogTitle>

          <DialogContent>
            <InputText
              name={"alunosName"}
              label={"Nome do Aluno"}
              type={"text"}
              id={"alunosName"}
              value={updatedalunosName}
              error={errors.alunosName}
              helperText={errors.alunosName && errors.alunosName.message}
              onChange={(e) => setUpdatedalunosName(e.target.value)}
              inputProps={{
                ...register("alunosName", {
                  required: {
                    value: true,
                    message: "Informe o nome do aluno.",
                  },
                }),
              }}
            />

            <InputText
              name={"alunosGenero"}
              label={"Genero"}
              type={"text"}
              id={"alunosGenero"}
              value={updatedalunosGenero}
              error={errors.alunosGenero}
              helperText={errors.alunosGenero && errors.alunosGenero.message}
              onChange={(e) => setUpdatedalunosGenero(e.target.value)}
              inputProps={{
                ...register("alunosGenero", {
                  required: {
                    value: true,
                    message: "Informe o genero.",
                  },
                }),
              }}
            />

            <InputText
              name={"alunosResponsavel"}
              label={"Nome do responsável"}
              type={"text"}
              id={"alunosResponsavel"}
              value={updatedalunosResponsavel}
              error={errors.alunosResponsavel}
              helperText={errors.alunosResponsavel && errors.alunosResponsavel.message}
              onChange={(e) => setUpdatedalunosResponsavel(e.target.value)}
              inputProps={{
                ...register("alunosResponsavel", {
                  required: {
                    value: true,
                    message: "Informe o nome do responsável.",
                  },
                }),
              }}
            />

            <InputText
              name={"alunosTelefone"}
              label={"Nome da escola"}
              type={"text"}
              id={"alunosTelefone"}
              value={updatedalunosTelefone}
              error={errors.alunosTelefone}
              helperText={errors.alunosTelefone && errors.alunosTelefone.message}
              onChange={(e) => setUpdatedalunosTelefone(e.target.value)}
              inputProps={{
                ...register("alunosTelefone", {
                  required: {
                    value: true,
                    message: "Informe o nome da escola.",
                  },
                }),
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="alunosTurma">Turma</InputLabel>
              <Select
                labelId="alunosTurma"
                type={"text"}
                id="alunosTurma"
                value={updatedalunosTurma}
                onChange={(e) => setUpdatedalunosTurma(e.target.value)}
                inputProps={{
                  ...register("alunosTurma", {
                    required: {
                      value: true,
                      message: "Informe a turma do aluno.",
                    },
                  }),
                }}
              >
                {turmas.map((turma) => (
                  <MenuItem key={turma.name} value={turma.name}>
                    {turma.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            <ButtonConfirm color={"error"} type={"submit"} onClick={() => removeAlunos()} props={"Sim, desejo apagar"} />
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
