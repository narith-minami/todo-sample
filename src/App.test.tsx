import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  test('初期状態で3つのTodoアイテムが表示される', () => {
    render(<App />);
    
    // タイトルが表示されていることを確認
    expect(screen.getByText('Todo Sample')).toBeInTheDocument();
    
    // 3つのTodoアイテムが表示されていることを確認
    expect(screen.getByText('買い物に行く')).toBeInTheDocument();
    expect(screen.getByText('レポートを提出する')).toBeInTheDocument();
    expect(screen.getByText('運動する')).toBeInTheDocument();
  });

  test('Todoアイテムの完了状態を切り替えられる', async () => {
    render(<App />);
    
    // 最初のTodoアイテムのチェックボックスを取得
    const checkboxes = screen.getAllByRole('checkbox');
    const checkbox = checkboxes[0];
    
    // チェックボックスをクリック
    await userEvent.click(checkbox);
    
    // 完了状態が切り替わったことを確認
    expect(checkbox).toBeChecked();
  });

  test('Todoアイテムを編集できる', async () => {
    render(<App />);
    
    // 最初のTodoアイテムの編集ボタンをクリック
    const editButtons = screen.getAllByText('編集');
    await userEvent.click(editButtons[0]);
    
    // タイトル入力フィールドを取得して編集
    const titleInput = screen.getByDisplayValue('買い物に行く');
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, '新しい買い物リスト');
    
    // 優先度を変更（編集モードのselect要素を取得）
    const prioritySelects = screen.getAllByRole('combobox');
    const editModeSelect = prioritySelects[1]; // 編集モードのselect要素
    await userEvent.selectOptions(editModeSelect, 'medium');
    
    // 保存ボタンをクリック
    const saveButton = screen.getByText('保存');
    await userEvent.click(saveButton);
    
    // 変更が反映されていることを確認
    expect(screen.getByText('新しい買い物リスト')).toBeInTheDocument();
  });

  test('Todoアイテムを削除できる', async () => {
    render(<App />);
    
    // 最初のTodoアイテムの削除ボタンをクリック
    const deleteButtons = screen.getAllByText('削除');
    await userEvent.click(deleteButtons[0]);
    
    // アイテムが削除されたことを確認
    expect(screen.queryByText('買い物に行く')).not.toBeInTheDocument();
  });

  test('新しいTodoアイテムを追加できる', async () => {
    render(<App />);
    
    // タイトルを入力
    const titleInput = screen.getByLabelText('タイトル');
    await userEvent.type(titleInput, '新しいタスク');
    
    // 優先度を選択
    const prioritySelect = screen.getByLabelText('優先度');
    await userEvent.selectOptions(prioritySelect, 'high');
    
    // 追加ボタンをクリック
    const addButton = screen.getByRole('button', { name: '追加' });
    await userEvent.click(addButton);
    
    // 新しいアイテムが追加されたことを確認
    expect(screen.getByText('新しいタスク')).toBeInTheDocument();
  });

  // Helper function to get todo titles in rendered order
  const getRenderedTodoTitles = () => {
    // This selector attempts to find the span containing the title within each TodoItem.
    // It looks for a div that is a sibling of the checkbox, then finds a span within it.
    // This is based on the structure observed in TodoItem.tsx.
    // A more robust way would be to add data-testid attributes to the title spans.
    const todoElements = screen.queryAllByRole('listitem'); // Assuming TodoItems are list items
    if (todoElements.length > 0) {
        return todoElements.map(item => {
            const titleElement = item.querySelector('span:not([class*="text-sm"])'); // Attempt to get the title span
            return titleElement ? titleElement.textContent || '' : '';
        });
    }
    // Fallback strategy if listitem role is not used, try to get by known text then map their current order.
    // This is less ideal as it relies on knowing the titles.
    // For dynamic tests, a better way is to ensure TodoItem has a consistent testable structure.
    // The example's regex approach is good for a fixed set of initial items.
    // For these tests, we'll identify items based on the div structure in TodoItem
    const allTodoItemDivs = Array.from(document.querySelectorAll('.flex.items-center.justify-between.p-2.border-b'));
    return allTodoItemDivs.map(div => {
      const titleSpan = div.querySelector('div.flex-grow > span:first-child');
      return titleSpan ? titleSpan.textContent : '';
    }).filter(title => title !== null && title !== ''); // Filter out any null or empty strings
  };


  describe('Todo Priority Sorting', () => {
    test('初期状態でTodoアイテムが優先度順に表示される', () => {
      render(<App />);
      const titles = getRenderedTodoTitles();
      // Default items: '買い物に行く' (high), 'レポートを提出する' (medium), '運動する' (low)
      expect(titles).toEqual([
        '買い物に行く',
        'レポートを提出する',
        '運動する',
      ]);
    });

    test('新しい「低」優先度Todoアイテムを追加するとリストの最後に表示される', async () => {
      render(<App />);
      await userEvent.type(screen.getByLabelText('タイトル'), '新しい低優先度タスク');
      await userEvent.selectOptions(screen.getByLabelText('優先度'), 'low');
      await userEvent.click(screen.getByRole('button', { name: '追加' }));

      const titles = getRenderedTodoTitles();
      expect(titles).toEqual([
        '買い物に行く',          // High
        'レポートを提出する',      // Medium
        '運動する',              // Low
        '新しい低優先度タスク',    // New Low
      ]);
    });

    test('新しい「高」優先度Todoアイテムを追加するとリストの最初に表示される', async () => {
      render(<App />);
      await userEvent.type(screen.getByLabelText('タイトル'), '新しい高優先度タスク');
      await userEvent.selectOptions(screen.getByLabelText('優先度'), 'high');
      await userEvent.click(screen.getByRole('button', { name: '追加' }));
      
      const titles = getRenderedTodoTitles();
      expect(titles).toEqual([
        '新しい高優先度タスク',    // New High
        '買い物に行く',          // High
        'レポートを提出する',      // Medium
        '運動する',              // Low
      ]);
    });

    test('新しい「中」優先度Todoアイテムを追加すると中優先度グループの最後に表示される', async () => {
      render(<App />);
      await userEvent.type(screen.getByLabelText('タイトル'), '新しい中優先度タスク');
      await userEvent.selectOptions(screen.getByLabelText('優先度'), 'medium');
      await userEvent.click(screen.getByRole('button', { name: '追加' }));

      const titles = getRenderedTodoTitles();
      expect(titles).toEqual([
        '買い物に行く',          // High
        'レポートを提出する',      // Medium
        '新しい中優先度タスク',    // New Medium
        '運動する',              // Low
      ]);
    });

    test('Todoアイテムの優先度を「低」から「高」に編集するとリストの最初に移動する', async () => {
      render(<App />);
      // '運動する' (low) is initially the last item. We need to find its edit button.
      // All edit buttons have the text '編集'.
      const editButtons = screen.getAllByText('編集');
      // Assuming the order of edit buttons matches the initial render order.
      // The last item '運動する' corresponds to the last edit button.
      await userEvent.click(editButtons[2]); // Click edit for '運動する'

      // Change priority to high
      // The select element for priority becomes visible. There are two: one in form, one in item.
      // The one in the item being edited is the one we want.
      // It's the last select on the page after clicking edit on the last item.
      const prioritySelects = screen.getAllByRole('combobox');
      await userEvent.selectOptions(prioritySelects[prioritySelects.length -1], 'high');
      await userEvent.click(screen.getByText('保存'));
      
      const titles = getRenderedTodoTitles();
      expect(titles).toEqual([
        '運動する',              // Now High
        '買い物に行く',          // High
        'レポートを提出する',      // Medium
      ]);
    });

    test('Todoアイテムの優先度を「高」から「低」に編集するとリストの最後に移動する', async () => {
      render(<App />);
      // '買い物に行く' (high) is initially the first item.
      const editButtons = screen.getAllByText('編集');
      await userEvent.click(editButtons[0]); // Click edit for '買い物に行く'
      
      const prioritySelects = screen.getAllByRole('combobox');
      // After clicking edit on the first item, its priority select is the second one on the screen
      // (first is TodoForm, second is the item being edited).
      await userEvent.selectOptions(prioritySelects[1], 'low');
      await userEvent.click(screen.getByText('保存'));

      const titles = getRenderedTodoTitles();
      expect(titles).toEqual([
        'レポートを提出する',      // Medium
        '運動する',              // Low
        '買い物に行く',          // Now Low
      ]);
    });
  });
}); 