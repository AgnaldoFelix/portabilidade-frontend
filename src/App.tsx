import AuthorizationPage from './pages/AuthorizationPage';
import SchedulePage from './pages/SchedulePage';
import OperationPage from './pages/OperationPage';
import { usePortabilityFlow } from './hooks/usePortabilityFlow';
import PortabilityLayout from './components/PortabilityLayout';
import './App.css';

export default function App() {
  const flow = usePortabilityFlow();

  return (
    <PortabilityLayout currentStep={flow.currentStep}>
      {flow.currentStep === 'authorization' && (
        <AuthorizationPage onAuthorized={flow.completeAuthorization} />
      )}

      {flow.currentStep === 'schedule' && (
        <SchedulePage
          beneficiaryId={flow.beneficiaryId}
          onBack={flow.returnToAuthorization}
          onOperationCreated={flow.completePortabilityRequest}
        />
      )}

      {flow.currentStep === 'operation' && (
        <OperationPage
          operationId={flow.operationId}
          beneficiaryId={flow.beneficiaryId}
          onBack={flow.returnToSchedule}
        />
      )}
    </PortabilityLayout>
  );
}
