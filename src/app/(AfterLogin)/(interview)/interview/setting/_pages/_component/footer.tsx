import { Button } from "@/components/ui/button";

interface FooterProps {
  setStep: (step: number) => void;
  step: number;
}

const Footer = ({ setStep, step }: FooterProps) => {
  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="mt-4 w-full flex justify-end">
      <Button disabled={step === 1} onClick={() => handlePrevStep()} variant="outline">
        이전
      </Button>
      <Button
        disabled={step === 3}
        onClick={() => handleNextStep()}
        className="ml-2"
        variant="outline"
      >
        다음
      </Button>
    </div>
  );
};

export default Footer;
