import { Card, CardDescription, CardTitle } from "../ui/card";

type ProcessFlowCardProps = {
  title?: string;
  description?: string;
};

const ProcessFlowCard = ({ title, description }: ProcessFlowCardProps) => {
  return (
    <Card className="md:max-w-[13rem] flex flex-col gap-3 px-2 py-5">
      <CardTitle className="text-xl leading-none font-bold">{title}</CardTitle>
      <CardDescription className="text-sm">{description}</CardDescription>
    </Card>
  );
};

export default ProcessFlowCard;
