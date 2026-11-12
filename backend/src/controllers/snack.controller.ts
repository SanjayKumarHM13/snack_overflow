import { Request, Response, NextFunction } from 'express';
import { snackService } from '../services/snack.service.js';
import { voteService } from '../services/vote.service.js';
import { summaryService } from '../services/summary.service.js';

export class SnackController {
  async listSnacks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await snackService.listSnacks(req.query as any, req.user?.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSnackById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const snack = await snackService.getSnackById(req.params.id, req.user?.id);
      res.status(200).json(snack);
    } catch (error) {
      next(error);
    }
  }

  async createSnack(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const snack = await snackService.createSnack(req.body);
      res.status(201).json(snack);
    } catch (error) {
      next(error);
    }
  }

  async updateSnack(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const snack = await snackService.updateSnack(req.params.id, req.body);
      res.status(200).json(snack);
    } catch (error) {
      next(error);
    }
  }

  async deleteSnack(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await snackService.deleteSnack(req.params.id);
      res.status(200).json({ message: 'Snack deleted successfully.' });
    } catch (error) {
      next(error);
    }
  }

  async consumeSnack(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { amount } = req.body;
      const result = await snackService.consumeSnack(req.params.id, amount, req.user!.id);
      res.status(200).json({
        message: 'Snack consumed successfully.',
        snack: result.snack,
        consumedAmount: result.consumedAmount,
      });
    } catch (error) {
      next(error);
    }
  }

  async restockSnack(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { amount } = req.body;
      const result = await snackService.restockSnack(req.params.id, amount, req.user!.id);
      res.status(200).json({
        message: 'Snack restocked successfully.',
        snack: result.snack,
        restockedAmount: result.restockedAmount,
      });
    } catch (error) {
      next(error);
    }
  }

  async vote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await voteService.castVote(req.params.id, req.user!.id);
      res.status(201).json({
        message: 'Vote recorded successfully.',
        voteCount: result.voteCount,
        hasVoted: result.hasVoted,
      });
    } catch (error) {
      next(error);
    }
  }

  async unvote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await voteService.removeVote(req.params.id, req.user!.id);
      res.status(200).json({
        message: 'Vote removed successfully.',
        voteCount: result.voteCount,
        hasVoted: result.hasVoted,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSummary(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const summary = await summaryService.getDashboardSummary();
      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  }
}

export const snackController = new SnackController();
