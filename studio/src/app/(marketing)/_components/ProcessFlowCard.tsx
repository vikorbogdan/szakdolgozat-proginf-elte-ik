import { Card, CardDescription, CardTitle } from "../../../components/ui/card";

type ProcessFlowCardProps = {
  title?: string;
  description?: string;
};

const ProcessFlowCard = ({ title, description }: ProcessFlowCardProps) => {
  return (
    <Card className="md:w-56 flex flex-col gap-3 md:px-6 px-2 py-5">
      <CardTitle className="text-xl leading-none font-bold">{title}</CardTitle>
      <CardDescription className="text-sm">{description}</CardDescription>
    </Card>
  );
};

export default ProcessFlowCard;
