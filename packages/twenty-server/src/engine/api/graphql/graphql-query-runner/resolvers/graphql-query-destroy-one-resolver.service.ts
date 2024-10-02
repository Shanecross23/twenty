import { Injectable } from '@nestjs/common';

import { ResolverService } from 'src/engine/api/graphql/graphql-query-runner/interfaces/resolver-service.interface';
import { Record as IRecord } from 'src/engine/api/graphql/workspace-query-builder/interfaces/record.interface';
import { WorkspaceQueryRunnerOptions } from 'src/engine/api/graphql/workspace-query-runner/interfaces/query-runner-option.interface';
import { DestroyOneResolverArgs } from 'src/engine/api/graphql/workspace-resolver-builder/interfaces/workspace-resolvers-builder.interface';

import {
  GraphqlQueryRunnerException,
  GraphqlQueryRunnerExceptionCode,
} from 'src/engine/api/graphql/graphql-query-runner/errors/graphql-query-runner.exception';
import { getObjectMetadataOrThrow } from 'src/engine/api/graphql/graphql-query-runner/utils/get-object-metadata-or-throw.util';
import { generateObjectMetadataMap } from 'src/engine/metadata-modules/utils/generate-object-metadata-map.util';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm-global.manager';
import { formatResult } from 'src/engine/twenty-orm/utils/format-result.util';

@Injectable()
export class GraphqlQueryDestroyOneResolverService
  implements ResolverService<DestroyOneResolverArgs, IRecord>
{
  constructor(
    private readonly twentyORMGlobalManager: TwentyORMGlobalManager,
  ) {}

  async resolve<ObjectRecord extends IRecord = IRecord>(
    args: DestroyOneResolverArgs,
    options: WorkspaceQueryRunnerOptions,
  ): Promise<ObjectRecord> {
    const { authContext, objectMetadataItem, objectMetadataCollection } =
      options;
    const repository =
      await this.twentyORMGlobalManager.getRepositoryForWorkspace(
        authContext.workspace.id,
        objectMetadataItem.nameSingular,
      );

    const objectMetadataMap = generateObjectMetadataMap(
      objectMetadataCollection,
    );

    const objectMetadata = getObjectMetadataOrThrow(
      objectMetadataMap,
      objectMetadataItem.nameSingular,
    );

    const nonFormattedRecordBeforeDeletion = await repository.findOne({
      where: { id: args.id },
      withDeleted: true,
    });

    if (!nonFormattedRecordBeforeDeletion) {
      throw new GraphqlQueryRunnerException(
        'Record not found',
        GraphqlQueryRunnerExceptionCode.RECORD_NOT_FOUND,
      );
    }

    const recordBeforeDeletion = formatResult(
      [nonFormattedRecordBeforeDeletion],
      objectMetadata,
      objectMetadataMap,
    )[0];

    await repository.delete(args.id);

    return recordBeforeDeletion as ObjectRecord;
  }

  validate(
    args: DestroyOneResolverArgs,
    _options: WorkspaceQueryRunnerOptions,
  ): void {
    if (!args.id) {
      throw new GraphqlQueryRunnerException(
        'Missing id',
        GraphqlQueryRunnerExceptionCode.INVALID_QUERY_INPUT,
      );
    }
  }
}
