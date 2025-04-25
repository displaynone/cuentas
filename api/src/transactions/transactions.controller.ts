import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
  Logger,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Transaction } from './domain/transaction';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllTransactionsDto } from './dto/find-all-transactions.dto';
import { TransactionMonthlyTotals } from './domain/transaction-monthly-totals';
import { GetTimelyTotalsDto } from './dto/get-timely-totals.dto';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'transactions',
  version: '1',
})
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);

  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('daily-totals')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: [TransactionMonthlyTotals],
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({
    type: [TransactionMonthlyTotals],
  })
  async findDailyTotals(@Query() getTimelyTotalsDto: GetTimelyTotalsDto) {
    return this.transactionsService.getDailyTotals(getTimelyTotalsDto);
  }

  @Get('monthly-totals')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: [TransactionMonthlyTotals],
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({
    type: [TransactionMonthlyTotals],
  })
  async findMonthlyTotals(@Query() getTimelyTotalsDto: GetTimelyTotalsDto) {
    return this.transactionsService.getMonthlyTotals(getTimelyTotalsDto);
  }

  @Get('yearly-totals')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: [TransactionMonthlyTotals],
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({
    type: [TransactionMonthlyTotals],
  })
  async findYearlyTotals(@Query() getTimelyTotalsDto: GetTimelyTotalsDto) {
    return this.transactionsService.getYearlyTotals(getTimelyTotalsDto);
  }

  @Get('daily-by-category')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: [TransactionMonthlyTotals],
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({
    type: [TransactionMonthlyTotals],
  })
  async findDailyByCategory(@Query() getTimelyTotalsDto: GetTimelyTotalsDto) {
    return this.transactionsService.getDailyByCategory(getTimelyTotalsDto);
  }

  @Get('monthly-by-category')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: [TransactionMonthlyTotals],
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({
    type: [TransactionMonthlyTotals],
  })
  async findMonthlyByCategory(@Query() getTimelyTotalsDto: GetTimelyTotalsDto) {
    return this.transactionsService.getMonthlyByCategory(getTimelyTotalsDto);
  }

  @Get('yearly-by-category')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: [TransactionMonthlyTotals],
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({
    type: [TransactionMonthlyTotals],
  })
  async findYearlyByCategory(@Query() getTimelyTotalsDto: GetTimelyTotalsDto) {
    return this.transactionsService.getYearlyByCategory(getTimelyTotalsDto);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({
    type: Transaction,
  })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: InfinityPaginationResponse(Transaction),
  })
  async findAll(
    @Query() query: FindAllTransactionsDto,
  ): Promise<InfinityPaginationResponseDto<Transaction>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.transactionsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Transaction,
  })
  findById(@Param('id') id: number) {
    return this.transactionsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Transaction,
  })
  update(
    @Param('id') id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.transactionsService.remove(id);
  }

  @Post('import')
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({
    type: [Transaction],
  })
  async import(
    @Request() request,
    @Body() importTransactionsDto: CreateTransactionDto[],
  ) {
    for (const dto of importTransactionsDto) {
      dto.userId = request.user.id;
      await this.transactionsService.upsert(dto);
    }
    return { result: true };
  }
}
