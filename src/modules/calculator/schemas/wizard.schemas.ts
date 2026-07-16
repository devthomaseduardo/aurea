import { z } from 'zod';

export const infoSchema = z.object({
  nome: z.string().min(3, 'Informe um nome com pelo menos 3 caracteres'),
  descricao: z.string().min(10, 'Descreva o projeto com mais detalhes'),
  valorHora: z.number().min(1, 'Valor/hora deve ser maior que zero'),
  moeda: z.enum(['BRL', 'USD']),
  regimeTributario: z.enum(['pf', 'mei', 'pj_simples', 'pj_lucro_presumido']),
  bufferSeguranca: z.number().min(0).max(100),
});

export const requisitoSchema = z.object({
  id: z.string(),
  descricao: z.string().min(3, 'Descreva o requisito'),
  complexidade: z.enum(['baixa', 'media', 'alta']),
  estimativaDias: z.number().min(0.5),
  estimativaHoras: z.number().min(1),
});

export const escopoSchema = z.object({
  requisitos: z.array(requisitoSchema).min(1, 'Adicione ao menos um requisito'),
});

export const tecnologiasSchema = z.object({
  tecnologias: z
    .array(
      z.object({
        id: z.string(),
        nome: z.string(),
        selecionada: z.boolean(),
        multiplicador: z.number().optional(),
      })
    )
    .refine((list) => list.some((t) => t.selecionada), {
      message: 'Selecione ao menos uma tecnologia',
    }),
  dominio: z.boolean(),
  hospedagem: z.boolean(),
  autenticacao: z.boolean(),
  pagamentos: z.boolean(),
  apis: z.boolean(),
  outrosServicos: z.array(z.string()),
});

export const partesSchema = z.object({
  contratante: z.object({
    nome: z.string().min(2, 'Nome do cliente é obrigatório'),
    documento: z.string().optional(),
    endereco: z.string().optional(),
  }),
  contratado: z.object({
    nome: z.string().min(2, 'Seu nome é obrigatório'),
    documento: z.string().optional(),
    endereco: z.string().optional(),
  }),
  modeloProposta: z.enum(['basico', 'padrao', 'premium']),
});

export type InfoFormValues = z.infer<typeof infoSchema>;
export type EscopoFormValues = z.infer<typeof escopoSchema>;
export type TecnologiasFormValues = z.infer<typeof tecnologiasSchema>;
export type PartesFormValues = z.infer<typeof partesSchema>;

export const WIZARD_STEPS = [
  { id: 'info', label: 'Informações', description: 'Dados básicos do projeto' },
  { id: 'escopo', label: 'Escopo', description: 'Requisitos e complexidade' },
  { id: 'tech', label: 'Tecnologias', description: 'Stack e serviços' },
  { id: 'custos', label: 'Custos', description: 'Modelo e partes' },
  { id: 'cronograma', label: 'Cronograma', description: 'Entregas e prazos' },
  { id: 'resumo', label: 'Resumo', description: 'Proposta final' },
] as const;
