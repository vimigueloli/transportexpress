import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { cloneElement, ReactElement } from 'react';

interface ActiveLinkProps extends LinkProps {
	children: ReactElement;
	shouldMatchExactHref?: boolean;
	className: string;
	activeClassName: string;
}

export function ActiveLink({
	children,
	shouldMatchExactHref = false,
	className,
	activeClassName,
	...rest
}: ActiveLinkProps) {
	const { asPath } = useRouter();
	const removeBar = (path: any) => path.substr(1);
	const isPrefixedBy = (path: any, prefix: any) => path.startsWith(prefix);
	const currentPath = removeBar(asPath);
	const linkPath = removeBar(String(rest.href));
	const aliasPath = removeBar(String(rest.as));
	const isIndex = linkPath === '';
	const isOnIndexRoute = currentPath === linkPath;

	if (
		(isIndex && isOnIndexRoute) ||
		(!isIndex &&
			(isPrefixedBy(currentPath, linkPath) ||
				isPrefixedBy(currentPath, aliasPath)))
	) {
		className = `${className} ${activeClassName}`;
	}

	return (
		<Link {...rest}>
			{cloneElement(children, {
				className,
			})}
		</Link>
	);
}
