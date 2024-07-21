import { Module } from '@nestjs/common';

import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';

import { WorkspaceDataSourceModule } from 'src/engine/workspace-datasource/workspace-datasource.module';
import { WorkspaceQueryRunnerModule } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-runner.module';
import { ObjectMetadataModule } from 'src/engine/metadata-modules/object-metadata/object-metadata.module';
import { ChartResolver } from 'src/engine/core-modules/chart/chart.resolver';
import { ChartService } from 'src/engine/core-modules/chart/chart.service';
import { TwentyORMModule } from 'src/engine/twenty-orm/twenty-orm.module';
import { FieldMetadataModule } from 'src/engine/metadata-modules/field-metadata/field-metadata.module';
import { RelationMetadataModule } from 'src/engine/metadata-modules/relation-metadata/relation-metadata.module';
import { FieldMetadataEntity } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import { RelationMetadataEntity } from 'src/engine/metadata-modules/relation-metadata/relation-metadata.entity';

@Module({
  imports: [
    WorkspaceDataSourceModule,
    WorkspaceQueryRunnerModule,
    ObjectMetadataModule,
    FieldMetadataModule,
    RelationMetadataModule,
    NestjsQueryTypeOrmModule.forFeature(
      [RelationMetadataEntity, FieldMetadataEntity],
      'metadata',
    ),
    TwentyORMModule,
  ],
  exports: [],
  providers: [ChartResolver, ChartService],
})
export class ChartModule {}
