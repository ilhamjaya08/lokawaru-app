-- Create a function to securely delete a user account
CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void AS $$
BEGIN
  -- Delete from public.users (will cascade from auth.users if set up correctly, but explicit is safer)
  DELETE FROM public.users WHERE id = auth.uid();
  
  -- Delete the user from auth.users
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to the function for authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;
