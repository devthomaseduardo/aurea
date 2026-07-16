import { useState } from 'react';
import {
  PageContainer,
  PageHeader,
  FormSection,
  FormGroup,
  FormActions,
} from '@/design-system/patterns';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useUiStore } from '@/stores/ui.store';
import { localStore } from '@/core/storage/local-storage';
import { toast } from '@/shared/components/ui/use-toast';
import { APP_CONFIG } from '@/core/config/app.config';

export default function SettingsPage() {
  const { theme, setTheme } = useUiStore();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  return (
    <PageContainer size="md">
      <PageHeader
        title="Configurações"
        description="Preferências da aplicação e dados locais."
      />

      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <FormSection title="Aparência" description="Tema e densidade da interface.">
            <FormGroup columns={2}>
              <div className="space-y-2">
                <Label>Tema</Label>
                <Select
                  value={theme}
                  onValueChange={(v) => setTheme(v as 'dark' | 'light')}
                >
                  <SelectTrigger className="bg-black/20 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Escuro (recomendado)</SelectItem>
                    <SelectItem value="light">Claro (experimental)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Modo compacto</p>
                  <p className="text-xs text-muted-foreground">Reduz espaçamentos</p>
                </div>
                <Switch checked={compactMode} onCheckedChange={setCompactMode} />
              </div>
            </FormGroup>
          </FormSection>
        </div>

        <div className="glass-card rounded-2xl p-6 md:p-8">
          <FormSection title="Notificações">
            <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <div>
                <p className="text-sm font-medium">Alertas de propostas</p>
                <p className="text-xs text-muted-foreground">
                  Lembretes de follow-up (local)
                </p>
              </div>
              <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
            </div>
          </FormSection>
        </div>

        <div className="glass-card rounded-2xl p-6 md:p-8">
          <FormSection
            title="Dados locais"
            description={`Os dados ficam no navegador sob o prefixo ${APP_CONFIG.storagePrefix}.`}
          >
            <FormActions className="border-0 pt-0">
              <Button
                variant="destructive"
                onClick={() => {
                  if (
                    confirm(
                      'Isso apagará clientes, propostas e contratos salvos neste navegador. Continuar?'
                    )
                  ) {
                    localStore.clearAll();
                    toast({ title: 'Dados locais limpos' });
                    window.location.reload();
                  }
                }}
              >
                Limpar todos os dados
              </Button>
              <Button
                className="btn-primary text-white"
                onClick={() => toast({ title: 'Preferências salvas' })}
              >
                Salvar preferências
              </Button>
            </FormActions>
          </FormSection>
        </div>
      </div>
    </PageContainer>
  );
}
