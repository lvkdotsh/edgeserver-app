import { useApp } from '@utils/queries/useApp';
import { useDeployments } from '@utils/queries/useDeployments';
import { formatDistance } from 'date-fns';
import { FC, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Deployment } from 'src/types/Deployment';

const DeploymentLink: FC<{ deployment: Deployment; app_id: string }> = ({
    deployment,
    app_id,
}) => {
    const timeDistance = useMemo(
        () =>
            formatDistance(new Date(), new Date(deployment.timestamp)) + ' ago',
        [deployment.timestamp]
    );

    return (
        <Link
            key={app_id}
            className="p-4 border-2 card flex hover:bg-black-700"
            to={'/app/' + app_id + '/deployment/' + deployment.deploy_id}
        >
            <div className="flex-1">
                <h3>{deployment.deploy_id}</h3>
                <p className="text-sm text-neutral-400">{deployment.sid}</p>
            </div>
            <div className="text-sm text-neutral-400">{timeDistance}</div>
        </Link>
    );
};

const DeploymentList: FC = () => {
    const app = useApp();
    const { data, isLoading, isSuccess } = useDeployments(app.app_id);
    const sorted_deployments = useMemo(() => {
        if (!isSuccess) return [];

        if (!data) return [];

        return [...data].sort(
            (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
        );
    }, [data, isSuccess]);

    return (
        <div className="gap-4 flex flex-col w-full">
            <h2 className="text-2xl">
                Deployments {data && data.length > 0 ? `(${data.length})` : ''}
            </h2>
            {isLoading && <p>Loading Deployments...</p>}
            {sorted_deployments &&
                sorted_deployments.map((deployments) => (
                    <DeploymentLink
                        deployment={deployments}
                        app_id={app.app_id}
                        key={deployments.deploy_id}
                    />
                ))}
        </div>
    );
};

export const AppDeploymentsPage: FC = () => {
    const app = useApp();

    return (
        <div className="containerd pt-8">
            <Helmet>
                <title>{app.name} / Deployments</title>
            </Helmet>
            <DeploymentList />
        </div>
    );
};
