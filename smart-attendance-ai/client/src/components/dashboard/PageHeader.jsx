import { cn } from '../../lib/utils';

export default function PageHeader({ title, description, children, className }) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground md:text-base">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
