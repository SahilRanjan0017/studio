
import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StyleAttributeCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
  animationDelay?: string;
}

export const StyleAttributeCard: React.FC<StyleAttributeCardProps> = ({ icon, title, children, className, animationDelay }) => {
  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fadeInUp", className)} style={{ animationDelay }}>
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-primary">
          <span className="mr-3 p-2 bg-primary/10 rounded-full">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-foreground">
        {children}
      </CardContent>
    </Card>
  );
};
