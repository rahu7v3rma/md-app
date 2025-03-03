import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

import { Colors } from '@/theme/colors';

type Props = Record<string, never>;

const Person: React.FunctionComponent<Props> = ({}: Props) => {
    return (
        <Svg width={16} height={20} viewBox="0 0 16 20" fill="none">
            <Path
                d="M1 17.111c0-2.413 1.697-4.468 4.004-4.848l.208-.035a17.134 17.134 0 015.576 0l.208.035c2.307.38 4.004 2.435 4.004 4.848C15 18.154 14.181 19 13.172 19H2.828C1.818 19 1 18.154 1 17.111zM12.083 4.938c0 2.174-1.828 3.937-4.083 3.937S3.917 7.112 3.917 4.937C3.917 2.764 5.745 1 8 1s4.083 1.763 4.083 3.938z"
                fill={Colors.theme.primary}
            />
            <Path
                d="M1 17.111c0-2.413 1.697-4.468 4.004-4.848l.208-.035a17.134 17.134 0 015.576 0l.208.035c2.307.38 4.004 2.435 4.004 4.848C15 18.154 14.181 19 13.172 19H2.828C1.818 19 1 18.154 1 17.111zM12.083 4.938c0 2.174-1.828 3.937-4.083 3.937S3.917 7.112 3.917 4.937C3.917 2.764 5.745 1 8 1s4.083 1.763 4.083 3.938z"
                stroke={Colors.theme.primary}
                strokeWidth={1.5}
            />
        </Svg>
    );
};

export default Person;
