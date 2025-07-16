import { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { cn } from "../../utils/classname-util";
import { BaseButton } from "../ui/BaseButton";

interface BaseCardProps {
  title: string;
  description: string;
  completed: boolean;
  expanded: boolean;
  onEdit?: () => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}

export function BaseCard({
  title,
  description,
  completed,
  expanded,
  onEdit,
  disabled = false,
  children,
  className
}: BaseCardProps) {
  return (
    <Card 
      className={cn(
        "transition-all",
        disabled ? "opacity-50 pointer-events-none" : "",
        !expanded && "bg-[#1A1A1A]/60 border-white/10",
        className
      )}
    >
      <CardHeader className="pb-0 mb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            {completed && (
              <svg 
                className="w-6 h-6 mt-0.5 flex-shrink-0" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fillRule="evenodd" clipRule="evenodd" d="M12.7716 3.03674C12.836 2.62757 13.22 2.34812 13.6291 2.41256C14.206 2.50342 14.7678 2.64605 15.3163 2.83905L15.3221 2.84111L15.3221 2.84113C20.3422 4.65445 22.9414 10.1936 21.1281 15.2137C19.3148 20.2337 13.7758 22.8329 8.75573 21.0197C7.61267 20.6071 6.59387 19.9987 5.72438 19.2492C5.29643 18.8909 4.91326 18.4992 4.57493 18.0752C4.31657 17.7514 4.3696 17.2795 4.69336 17.0212C5.01713 16.7628 5.48903 16.8158 5.74739 17.1396C6.02281 17.4847 6.33673 17.806 6.69118 18.1024L6.70014 18.1098L6.70008 18.1099C7.4351 18.7443 8.2966 19.2593 9.265 19.6088L9.26516 19.6089C13.5061 21.1408 18.1855 18.945 19.7173 14.7041C21.2489 10.4641 19.0544 5.78593 14.8154 4.25297C14.3529 4.09038 13.8804 3.97064 13.3958 3.8943C12.9866 3.82985 12.7071 3.44591 12.7716 3.03674Z" fill="#3FE6A3"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M3.13885 12.6744C3.54848 12.613 3.93036 12.8952 3.9918 13.3049C4.07602 13.8663 4.23061 14.4168 4.43112 14.94C4.57932 15.3268 4.38591 15.7605 3.99911 15.9087C3.61232 16.0569 3.17862 15.8635 3.03042 15.4767C2.79696 14.8675 2.611 14.2114 2.5084 13.5274C2.44696 13.1177 2.72922 12.7359 3.13885 12.6744Z" fill="#3FE6A3"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M7.01558 4.57152C7.2792 4.89102 7.2339 5.36373 6.9144 5.62735C6.51193 5.95943 6.14178 6.32175 5.82759 6.70421C5.56466 7.02427 5.09205 7.07058 4.77199 6.80765C4.45192 6.54472 4.40561 6.07211 4.66855 5.75205C5.05297 5.2841 5.4943 4.8544 5.95975 4.47035C6.27925 4.20673 6.75196 4.25203 7.01558 4.57152Z" fill="#3FE6A3"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M4.0918 7.91512C4.47425 8.07417 4.65536 8.51315 4.49631 8.89561C4.26577 9.44994 4.10226 10.0426 4.00682 10.6562C3.94317 11.0655 3.55977 11.3457 3.15048 11.2821C2.74118 11.2184 2.46099 10.835 2.52464 10.4257C2.63742 9.70054 2.83198 8.99127 3.1113 8.31962C3.27035 7.93717 3.70934 7.75606 4.0918 7.91512Z" fill="#3FE6A3"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M11.4227 3.04006C11.4847 3.4496 11.2031 3.83191 10.7935 3.89398C10.2241 3.98029 9.67698 4.12644 9.16762 4.33036C8.78308 4.48431 8.34655 4.29738 8.1926 3.91283C8.03865 3.52829 8.22558 3.09176 8.61012 2.93781C9.23334 2.68831 9.89276 2.51337 10.5688 2.41092C10.9783 2.34885 11.3606 2.63052 11.4227 3.04006Z" fill="#3FE6A3"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M21.9035 5.06042C22.1059 5.42181 21.977 5.87886 21.6156 6.08126C17.0262 8.65155 14.1562 12.8218 12.7873 15.3935C12.6601 15.6325 12.414 15.7844 12.1433 15.7909C11.8727 15.7974 11.6195 15.6576 11.481 15.425C10.5622 13.8829 9.39676 12.5103 7.97529 11.3107C7.65873 11.0436 7.61869 10.5704 7.88583 10.2538C8.15298 9.93728 8.62616 9.89723 8.94272 10.1644C10.156 11.1883 11.2023 12.3323 12.0826 13.5932C13.6972 10.8935 16.5652 7.19051 20.8827 4.77253C21.244 4.57013 21.7011 4.69902 21.9035 5.06042Z" fill="#3FE6A3"/>
              </svg>
            )}
            <div className="flex-1">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          {completed && onEdit && (
            <BaseButton
              onClick={onEdit}
              variant="default"
              size="small"
            >
              Edit
            </BaseButton>
          )}
        </div>
      </CardHeader>
      
      {expanded && children && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
}